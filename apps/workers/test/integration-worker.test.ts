import { expect, test } from "bun:test";
import { MailIntegrationWorker } from "@opencok/mail/services/integration-worker";
import type { Schedule } from "@opencok/core/schedule";

function startMailGiftRelay(dispatch: () => Promise<number>, report: () => void, after: Schedule)
{
    const worker = new MailIntegrationWorker({
        gift: {
            deliver: dispatch,
            backlog: async () => ({ pending: 0, limited: false, oldestAt: null }),
        },
        report,
        after,
    });
    void worker.start();
    return worker;
}

function scheduler()
{
    const tasks = new Map<number, () => void>();
    const delays: number[] = [];
    let sequence = 0;
    return {
        tasks,
        delays,
        after: (run: () => void, delay: number) => {
            const id = ++sequence;
            tasks.set(id, run);
            delays.push(delay);
            return () => {
                tasks.delete(id);
            };
        },
        next: () => {
            const entry = tasks.entries().next().value;
            if (!entry)
            {
                throw new Error("No scheduled relay");
            }
            tasks.delete(entry[0]);
            entry[1]();
        },
    };
}
async function settle()
{
    for (let index = 0; index < 12; index++)
    {
        await Promise.resolve();
    }
}

test("gift relay retries after a fixed delay, reports no dependency details and never overlaps batches", async () => {
    const timer = scheduler();
    let resolve: (value: number) => void = () => {};
    let calls = 0;
    let reports = 0;
    const worker = startMailGiftRelay(
        async () => {
            calls++;
            if (calls === 1)
            {
                throw new Error("Synthetic private dependency details");
            }
            return new Promise<number>((done) => {
                resolve = done;
            });
        },
        () => {
            reports++;
        },
        timer.after,
    );
    await settle();
    expect(reports).toBe(1);
    expect(calls).toBe(1);
    expect(timer.delays).toEqual([5000]);
    timer.next();
    await settle();
    expect(calls).toBe(2);
    expect(timer.tasks.size).toBe(0);
    resolve(100);
    await settle();
    expect(timer.delays).toEqual([5000, 5000]);
    await worker.close();
    expect(timer.tasks.size).toBe(0);
    await worker.close();
    expect(calls).toBe(2);
});

test("gift relay shutdown drains an in-flight dispatch before releasing its database and schedules no retry", async () => {
    const timer = scheduler();
    let finish: (value: number) => void = () => {};
    let drained = false;
    let calls = 0;
    const worker = startMailGiftRelay(
        () => {
            calls++;
            return new Promise<number>((resolve) => {
                finish = resolve;
            });
        },
        () => {},
        timer.after,
    );
    const closing = worker.close().then(() => {
        drained = true;
    });
    await settle();
    expect(drained).toBe(false);
    expect(timer.tasks.size).toBe(0);
    finish(1);
    await closing;
    expect(drained).toBe(true);
    expect(timer.tasks.size).toBe(0);
    expect(timer.delays).toEqual([]);
    expect(calls).toBe(1);
});

test("synchronous dispatch and reporting failures do not terminate retry scheduling", async () => {
    const timer = scheduler();
    const worker = startMailGiftRelay(
        () => {
            throw new Error("Synthetic dispatch failure");
        },
        () => {
            throw new Error("Synthetic reporting failure");
        },
        timer.after,
    );
    await settle();
    expect(timer.tasks.size).toBe(1);
    timer.next();
    await settle();
    expect(timer.delays).toEqual([5000, 5000]);
    await worker.close();
    expect(timer.tasks.size).toBe(0);
});

test("independent queues retain bounded progress while one dependency fails", async () => {
    const timer = scheduler();
    let gifts = 0;
    let chats = 0;
    const reports: string[] = [];
    const worker = new MailIntegrationWorker({
        gift: {
            deliver: async () => {
                gifts++;
                throw new Error("Private dependency details");
            },
            backlog: async () => ({ pending: 1, limited: false, oldestAt: 1n }),
        },
        chat: {
            deliver: async () => {
                chats++;
                return 1;
            },
            backlog: async () => ({ pending: 900, limited: true, oldestAt: 100n }),
        },
        report: (kind) => reports.push(kind),
        now: () => 1000,
        after: timer.after,
    });
    try
    {
        await worker.start();
        expect(gifts).toBe(1);
        expect(chats).toBe(50);
        expect(reports).toEqual(["gift"]);
        expect(worker.isReady()).toBe(false);
        expect(worker.status().chat).toEqual({
            ready: true,
            pending: 900,
            limited: true,
            oldestAgeMs: 900,
            delivered: 50,
        });
        expect(timer.tasks.size).toBe(2);
    }
    finally
    {
        await worker.close();
    }
    expect(timer.tasks.size).toBe(0);
});

test("closing between chat intents drains only admitted work and coalesces simultaneous runs", async () => {
    const timer = scheduler();
    const entered = Promise.withResolvers<void>();
    const finish = Promise.withResolvers<number>();
    let calls = 0;
    let backlogReads = 0;
    const worker = new MailIntegrationWorker({
        gift: {
            deliver: async () => 0,
            backlog: async () => ({ pending: 0, limited: false, oldestAt: null }),
        },
        chat: {
            deliver: async () => {
                calls++;
                entered.resolve();
                return finish.promise;
            },
            backlog: async () => {
                backlogReads++;
                return { pending: 1, limited: false, oldestAt: 1n };
            },
        },
        report: () => {},
        after: timer.after,
    });
    const started = worker.start();
    await entered.promise;
    const concurrent = worker.run();
    let drained = false;
    const closing = worker.close().then(() => {
        drained = true;
    });
    await settle();
    expect(drained).toBe(false);
    expect(calls).toBe(1);
    finish.resolve(1);
    await Promise.all([started, concurrent, closing]);
    expect(calls).toBe(1);
    expect(backlogReads).toBe(0);
    expect(worker.isReady()).toBe(false);
    expect(timer.tasks.size).toBe(0);
    await worker.start();
    await worker.run();
    expect(calls).toBe(1);
});

test("permission revalidation stops new queue work and clears readiness after privilege drift", async () => {
    const timer = scheduler();
    let allowed = true;
    let deliveries = 0;
    let validations = 0;
    const failures: string[] = [];
    const worker = new MailIntegrationWorker({
        validate: async () => {
            validations++;
            if (!allowed)
            {
                throw new Error("Unsafe worker grants");
            }
        },
        gift: {
            deliver: async () => {
                deliveries++;
                return 0;
            },
            backlog: async () => ({ pending: 0, limited: false, oldestAt: null }),
        },
        report: (kind) => failures.push(kind),
        after: timer.after,
    });
    try
    {
        await worker.start();
        expect(worker.isReady()).toBe(true);
        expect(deliveries).toBe(1);
        allowed = false;
        await worker.run();
        expect(worker.isReady()).toBe(false);
        expect(deliveries).toBe(1);
        expect(validations).toBe(2);
        expect(failures).toEqual(["gift"]);
        allowed = true;
        await worker.run();
        expect(worker.isReady()).toBe(true);
        expect(deliveries).toBe(2);
    }
    finally
    {
        await worker.close();
    }
});
