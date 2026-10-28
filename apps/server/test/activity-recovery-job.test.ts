import { expect, test } from "bun:test";
import { sfs } from "@opencok/messages/sfs";
import { ActivityRecoveryJob } from "../src/activity-recovery-job.ts";

type Dependencies = ConstructorParameters<typeof ActivityRecoveryJob>;

function saved(uuid = "old")
{
    return { uuid, ownerId: "owner", type: 0, itemId: "item", startTime: 11n, updateTime: 22n };
}

function due(id = "due")
{
    return {
        id,
        ownerId: "owner",
        queueId: `queue-${id}`,
        type: 0,
        itemId: "item",
        startedAt: 11n,
        dueAt: 22n,
        version: 3,
        status: 0,
        data: null,
    };
}

function fixture(overrides: {
    ready?: Dependencies[0];
    types?: Dependencies[1];
    imports?: Dependencies[2];
    due?: Dependencies[3];
    restore?: Dependencies[4];
    command?: Dependencies[5];
    failure?: Dependencies[6];
    now?: Dependencies[7];
} = {})
{
    return new ActivityRecoveryJob(
        overrides.ready ?? (() => {}),
        overrides.types ?? (() => [0, 2]),
        overrides.imports ?? (async () => []),
        overrides.due ?? (async () => []),
        overrides.restore ?? (async () => {}),
        overrides.command ?? (async () => {}),
        overrides.failure ?? (() => {
            throw new Error("Unexpected recovery failure");
        }),
        overrides.now ?? (() => 100),
    );
}

test("activity recovery awaits imports, preserves operation identities and isolates per-entry failures", async () => {
    const calls: string[] = [];
    const failures: string[] = [];
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    let now = 100;
    let types = [0, 2];
    const job = fixture({
        ready: () => {
            calls.push("ready");
        },
        types: () => types,
        imports: async (selected, limit, owner, after) => {
            expect([selected, limit, owner, after]).toEqual([[0, 2], 64, undefined, undefined]);
            calls.push("imports");
            return [saved(), saved("bad")];
        },
        restore: async (owner, operationId, queueId) => {
            calls.push(`restore:${queueId}`);
            if (queueId === "bad")
            {
                throw new Error("Synthetic import failure");
            }
            expect(owner).toBe("owner");
            expect(operationId).toBe(
                "restore:58648e466982e8ffcc21c1fbe51a512fe7595165fd3e78e93cbecd65988c6d12",
            );
            entered.resolve();
            await release.promise;
            now = 200;
            types = [0, 2, 3];
        },
        due: async (selected, at, limit, owner, after) => {
            expect([selected, at, limit, owner, after]).toEqual([
                [0, 2, 3],
                200n,
                64,
                undefined,
                undefined,
            ]);
            calls.push("due");
            return [due("bad"), due()];
        },
        command: async (owner, command, params) => {
            calls.push(`finish:${params.activityId!.value}`);
            if (params.activityId!.value === "bad")
            {
                throw new Error("Synthetic completion failure");
            }
            expect(owner).toBe("owner");
            expect(command).toBe("queue.finish");
            expect(params).toEqual({
                uuid: sfs.string("queue-due"),
                activityId: sfs.string("due"),
                version: sfs.int(3),
                operationId: sfs.string("finish:due:3"),
            });
        },
        failure: (event) => {
            failures.push(event);
        },
        now: () => now,
    });
    const running = job.run();
    await entered.promise;
    expect(calls).toEqual(["ready", "imports", "restore:old"]);
    release.resolve();
    await running;
    expect(calls).toEqual([
        "ready",
        "imports",
        "restore:old",
        "restore:bad",
        "due",
        "finish:bad",
        "finish:due",
    ]);
    expect(failures).toEqual(["activity_import_failed", "activity_recovery_failed"]);
});

test("owner recovery stops before the requested queue and preserves background cursors across calls and restart", async () => {
    const imports = Array.from({ length: 64 }, (_, index) => saved(`old-${index}`));
    const activities = Array.from({ length: 64 }, (_, index) => due(`due-${index}`));
    const importCalls: unknown[][] = [];
    const dueCalls: unknown[][] = [];
    const finished: string[] = [];
    const create = () =>
        fixture({
            imports: async (_, limit, owner, after) => {
                importCalls.push([limit, owner, after]);
                return owner || after ? [] : imports;
            },
            due: async (_, __, limit, owner, after) => {
                dueCalls.push([limit, owner, after]);
                return owner
                    ? [due("first"), due("target"), due("later")]
                    : after
                    ? []
                    : activities;
            },
            command: async (_, __, params) => {
                finished.push(String(params.activityId!.value));
            },
        });
    const job = create();
    await job.run();
    finished.length = 0;
    await job.run("owner", "queue-target");
    expect(finished).toEqual(["first"]);
    await job.run();
    await job.run();
    await create().run();
    expect(importCalls).toEqual([
        [64, undefined, undefined],
        [256, "owner", undefined],
        [64, undefined, "old-63"],
        [64, undefined, undefined],
        [64, undefined, undefined],
    ]);
    expect(dueCalls).toEqual([
        [64, undefined, undefined],
        [256, "owner", undefined],
        [64, undefined, activities[63]],
        [64, undefined, undefined],
        [64, undefined, undefined],
    ]);
});

test("an unready authority aborts before reading or changing recovery progress", async () => {
    let selected = false;
    await expect(
        fixture({
            ready: () => {
                throw new Error("Synthetic authority unavailable");
            },
            imports: async () => {
                selected = true;
                return [];
            },
        }).run(),
    ).rejects.toThrow("Synthetic authority unavailable");
    expect(selected).toBe(false);
});

for (const stage of ["import", "due"])
{
    test(`${stage} selection failure preserves its cursor and propagates to the caller`, async () => {
        const imports = Array.from({ length: 64 }, (_, index) => saved(`old-${index}`));
        const activities = Array.from({ length: 64 }, (_, index) => due(`due-${index}`));
        const importCursors: unknown[] = [];
        const dueCursors: unknown[] = [];
        let failed = false;
        const job = fixture({
            imports: async (_, __, ___, after) => {
                importCursors.push(after);
                if (stage === "import" && after && !failed)
                {
                    failed = true;
                    throw new Error("Synthetic selector failure");
                }
                return after ? [] : imports;
            },
            due: async (_, __, ___, ____, after) => {
                dueCursors.push(after);
                if (stage === "due" && after && !failed)
                {
                    failed = true;
                    throw new Error("Synthetic selector failure");
                }
                return after ? [] : activities;
            },
        });
        await job.run();
        await expect(job.run()).rejects.toThrow("Synthetic selector failure");
        await job.run();
        expect(importCursors).toEqual(
            stage === "import"
                ? [undefined, "old-63", "old-63"]
                : [undefined, "old-63", undefined],
        );
        expect(dueCursors).toEqual(
            stage === "import"
                ? [undefined, activities[63]]
                : [undefined, activities[63], activities[63]],
        );
    });
}
