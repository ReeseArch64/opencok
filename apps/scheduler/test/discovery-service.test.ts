import { expect, test } from "bun:test";
import { ActivityDiscoveryService } from "@opencok/queues/services/discovery";
import type {
    ActivityDiscoveryReader,
    ActivityDueCursor,
} from "@opencok/queues/contracts/discovery";
import type { DueActivitySnapshot } from "@opencok/queues/contracts/deadline";
import { ActivityDispatchResult } from "@opencok/queues/enums/dispatch-result";

function candidate(index: number, ownerId = "owner", dueAt = 100n): DueActivitySnapshot
{
    return {
        id: String(index).padStart(4, "0"),
        ownerId,
        queueId: `q${index}`,
        type: 0,
        dueAt,
        version: 1,
    };
}

function fixture(initial: DueActivitySnapshot[])
{
    const rows = [...initial];
    const pages: { after?: ActivityDueCursor; through?: ActivityDueCursor; now: bigint; }[] = [];
    const sent: string[] = [];
    let clock = 100;
    let reports = 0;
    let validationFailure = false;
    let types: readonly number[] = [0];
    const compare = (a: ActivityDueCursor, b: ActivityDueCursor) =>
        a.dueAt === b.dueAt ? a.id < b.id ? -1 : a.id === b.id ? 0 : 1 : a.dueAt < b.dueAt ? -1 : 1;
    const eligible = (selected: readonly number[], now: bigint) =>
        rows
            .filter((row) => selected.includes(row.type) && row.dueAt <= now).sort(compare);
    const reader: ActivityDiscoveryReader = {
        bounds: async (selected, now) => ({
            legacy: null,
            due: eligible(selected, now).at(-1) ?? null,
        }),
        legacy: async () => [],
        due: async (selected, now, limit, after, through) => {
            pages.push({ after, through, now });

            return eligible(selected, now).filter((row) =>
                (!after || compare(row, after) > 0)
                && (!through || compare(row, through) <= 0)
            ).slice(0, limit);
        },
        backlog: async (selected, now) => ({
            legacy: 0,
            due: eligible(selected, now).length,
            legacyLimited: false,
            dueLimited: false,
            oldestDueAt: eligible(selected, now)[0]?.dueAt ?? null,
        }),
    };
    const options = {
        reader,
        dispatcher: {
            capabilities: async () => types,
            restore: async () => ActivityDispatchResult.Applied,
            finish: async (row: DueActivitySnapshot) => {
                sent.push(row.id);

                return ActivityDispatchResult.Blocked;
            },
        },
        validate: async () => {
            if (validationFailure)
            {
                throw new Error("revoked");
            }
        },
        report: () => {
            reports++;
        },
        now: () => clock,
        batchSize: 8,
        ownerBudget: 2,
    };

    return {
        rows,
        pages,
        sent,
        options,
        setClock: (value: number) => {
            clock = value;
        },
        setTypes: (value: readonly number[]) => {
            types = value;
        },
        revoke: () => {
            validationFailure = true;
        },
        reports: () => reports,
    };
}

test("per-owner budgets let other owners progress while the owner blocks reordered work", async () => {
    const f = fixture([
        ...Array.from({ length: 10 }, (_, index) => candidate(index + 1)),
        candidate(11, "other"),
    ]);
    const applied: string[] = [];
    const service = new ActivityDiscoveryService({
        ...f.options,
        dispatcher: {
            ...f.options.dispatcher,
            finish: async (row) => {
                if (
                    f.rows.some((earlier) => earlier.ownerId === row.ownerId && earlier.id < row.id)
                )
                {
                    return ActivityDispatchResult.Blocked;
                }
                f.rows.splice(f.rows.indexOf(row), 1);
                applied.push(row.id);

                return ActivityDispatchResult.Applied;
            },
        },
    });
    await service.run();
    expect(applied).toEqual(["0001", "0002"]);
    expect(service.status().skippedOwnerBudget).toBe(6);
    await service.run();
    expect(applied).toEqual(["0001", "0002", "0011"]);
    expect(service.status().blocked).toBe(2);
    for (let pass = 0; pass < 6; pass++)
    {
        await service.run();
    }
    expect(applied.filter((id) => id !== "0011")).toEqual(
        Array.from({ length: 10 }, (_, index) => String(index + 1).padStart(4, "0")),
    );
    expect(f.rows).toHaveLength(0);
    await service.close();
});

test("head retries discover work inserted behind the cursor without resetting normal progress", async () => {
    const f = fixture(
        Array.from({ length: 100 }, (_, index) => candidate(index + 1, `owner${index}`)),
    );
    const service = new ActivityDiscoveryService(f.options);
    for (let pass = 0; pass < 7; pass++)
    {
        await service.run();
    }
    f.rows.push(candidate(200, "inserted", 99n));
    f.setClock(200);
    f.rows.push(candidate(201, "tail", 150n));
    await service.run();
    expect(service.status().headRetry).toBe(true);
    expect(f.sent).toContain("0200");
    expect(f.pages.at(-1)?.after).toBeUndefined();
    await service.run();
    expect(service.status().headRetry).toBe(false);
    expect(f.pages.at(-1)?.after?.id).toBe("0056");
    expect(f.pages.at(-1)?.through?.id).toBe("0100");
    expect(f.pages.at(-1)?.now).toBe(100n);
    expect(f.sent).not.toContain("0201");
    await service.close();
});

test("capability changes discard the old horizon and unsupported types stay untouched", async () => {
    const f = fixture([candidate(1), { ...candidate(2, "second"), type: 19 }]);
    const service = new ActivityDiscoveryService(f.options);
    await service.run();
    expect(f.sent).toEqual(["0001"]);
    f.setTypes([19]);
    await service.run();
    expect(f.sent).toEqual(["0001", "0002"]);
    expect(service.status().types).toBe(1);
    expect(f.rows).toHaveLength(2);
    await service.close();
});

test("permission and capability failures prevent discovery and remove readiness", async () => {
    const f = fixture([candidate(1)]);
    const service = new ActivityDiscoveryService(f.options);
    await service.run();
    expect(service.isReady()).toBe(true);
    f.revoke();
    await service.run();
    expect(service.isReady()).toBe(false);
    expect(f.sent).toEqual(["0001"]);
    expect(f.reports()).toBe(1);
    const invalid = fixture([candidate(1)]);
    invalid.setTypes([0, 0]);
    const second = new ActivityDiscoveryService(invalid.options);
    await second.run();
    expect(invalid.pages).toHaveLength(0);
    expect(invalid.sent).toHaveLength(0);
    expect(second.isReady()).toBe(false);
    await Promise.all([service.close(), second.close()]);
});

test("drain waits for the admitted dispatch, prevents overlap and stops before the next candidate", async () => {
    const f = fixture([candidate(1, "one"), candidate(2, "two")]);
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const service = new ActivityDiscoveryService({
        ...f.options,
        dispatcher: {
            ...f.options.dispatcher,
            finish: async (row) => {
                f.sent.push(row.id);
                entered.resolve();
                await release.promise;

                return ActivityDispatchResult.Applied;
            },
        },
    });
    const active = service.run();
    await entered.promise;
    expect(service.run()).toBe(active);
    let closed = false;
    const closing = service.close().then(() => {
        closed = true;
    });
    await Promise.resolve();
    expect(closed).toBe(false);
    expect(service.isReady()).toBe(false);
    release.resolve();
    await closing;
    expect(f.sent).toEqual(["0001"]);
    await service.run();
    expect(f.sent).toEqual(["0001"]);
});
