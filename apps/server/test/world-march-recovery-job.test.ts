import { expect, test } from "bun:test";
import { sfs } from "@opencok/messages/sfs";
import { WorldMarchRecoveryJob } from "../src/world-march-recovery-job.ts";

test("march recovery settles each owner before dispatch and isolates import and due failures", async () => {
    const calls: string[] = [];
    const reports: string[] = [];
    const entered = Promise.withResolvers<void>();
    const release = Promise.withResolvers<void>();
    const job = new WorldMarchRecoveryJob(
        async () => [
            { id: "orphan", owner: null },
            { id: "old-failed", owner: "failed" },
            { id: "old", owner: "imported" },
        ],
        async (now) => {
            expect(now).toBe(456n);
            calls.push("select-due");

            return [
                { id: "due-failed", owner: "dispatch-failed", version: 2, dueAt: 123n },
                { id: "due", owner: "active", version: 7, dueAt: 124n },
            ];
        },
        async (owner) => {
            calls.push(`settle:${owner}`);

            if (owner === "failed")
            {
                entered.resolve();
                await release.promise;
                throw new Error("Synthetic settlement failure");
            }
        },
        async (owner, command, params) => {
            expect(command).toBe("world.tick");
            calls.push(`dispatch:${owner}`);
            expect(params).toEqual({
                operationId: sfs.string(
                    owner === "imported"
                        ? "world-import:old"
                        : owner === "active"
                        ? "world:due:7"
                        : "world:due-failed:2",
                ),
            });

            if (owner === "dispatch-failed")
            {
                throw new Error("Synthetic command failure");
            }
        },
        (event) => reports.push(event),
        () => 456,
    );
    const running = job.run();
    await entered.promise;
    expect(calls).toEqual(["settle:failed"]);
    release.resolve();
    await running;
    expect(calls).toEqual([
        "settle:failed",
        "settle:imported",
        "dispatch:imported",
        "select-due",
        "settle:dispatch-failed",
        "dispatch:dispatch-failed",
        "settle:active",
        "dispatch:active",
    ]);
    expect(reports).toEqual(["world_import_failed", "world_recovery_failed"]);
});

test("full pages advance independent cursors and partial or empty pages wrap without skipping orphan imports", async () => {
    const imports = Array.from({ length: 64 }, (_, index) => ({ id: `old-${index}`, owner: null }));
    const due = Array.from({ length: 64 }, (_, index) => ({
        id: `due-${index}`,
        owner: "active",
        version: 3,
        dueAt: BigInt(index),
    }));
    const importCursors: (string | undefined)[] = [];
    const dueCursors: ({ dueAt: bigint; id: string; } | undefined)[] = [];
    let runs = 0;
    const create = () =>
        new WorldMarchRecoveryJob(
            async (after) => {
                importCursors.push(after);

                return after ? [{ id: "tail", owner: null }] : imports;
            },
            async (_, after) => {
                dueCursors.push(after);

                return after ? [] : due;
            },
            async () => {},
            async () => {
                runs++;
            },
            () => {
                throw new Error("Unexpected failure");
            },
            () => 100,
        );
    const job = create();
    await job.run();
    await job.run();
    await job.run();
    await create().run();
    expect(importCursors).toEqual([undefined, "old-63", undefined, undefined]);
    expect(dueCursors).toEqual([undefined, due[63], undefined, undefined]);
    expect(runs).toBe(192);
});

for (const failingSelection of ["import", "due"])
{
    test(`${failingSelection} selection failures preserve the prior cursor and abort the current pass`, async () => {
        const imports = Array.from(
            { length: 64 },
            (_, index) => ({ id: `old-${index}`, owner: null }),
        );
        const due = Array.from({ length: 64 }, (_, index) => ({
            id: `due-${index}`,
            owner: "active",
            version: 3,
            dueAt: BigInt(index),
        }));
        const importCursors: (string | undefined)[] = [];
        const dueCursors: ({ dueAt: bigint; id: string; } | undefined)[] = [];
        let failed = false;
        const job = new WorldMarchRecoveryJob(
            async (after) => {
                importCursors.push(after);

                if (after && !failed && failingSelection === "import")
                {
                    failed = true;
                    throw new Error("Synthetic selection failure");
                }

                return after ? [] : imports;
            },
            async (_, after) => {
                dueCursors.push(after);

                if (after && !failed && failingSelection === "due")
                {
                    failed = true;
                    throw new Error("Synthetic selection failure");
                }

                return after ? [] : due;
            },
            async () => {},
            async () => {},
            () => {
                throw new Error("Selection failures must propagate");
            },
            () => 100,
        );
        await job.run();
        await expect(job.run()).rejects.toThrow("Synthetic selection failure");
        await job.run();
        expect(dueCursors).toEqual(
            failingSelection === "import"
                ? [undefined, due[63]]
                : [undefined, due[63], due[63]],
        );
        expect(importCursors).toEqual(
            failingSelection === "import"
                ? [undefined, "old-63", "old-63"]
                : [undefined, "old-63", undefined],
        );
    });
}
