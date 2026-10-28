import { createRealmQuestRepository } from "../src/composition/quest-persistence";
import { expect, test } from "bun:test";
import { QuestChanges } from "@opencok/tasks/rules/changes";
import { num } from "@opencok/contracts/rows";
import type { MutationTransaction } from "@opencok/repositories/mutation";
import type { Row } from "@opencok/contracts/rows";

const { changedQuestRows } = new QuestChanges({ num });

test("quest deltas preserve claims and distinguish daily types and resets", () => {
    const before = [
        { uid: "owner", id: 1, type: 0, state: 2, num: 9 },
        { uid: "owner", id: 1, type: 1, state: 1, num: 5 },
    ];
    expect(changedQuestRows(structuredClone(before), before, true)).toEqual([]);
    const after = structuredClone(before);
    after[1]!.state = 2;
    expect(changedQuestRows(after, before, true)).toEqual([after[1]!]);
    expect(changedQuestRows(after, [], true)).toEqual(after);
});

test("nine unchanged initialization stages avoid 9252 redundant quest writes", async () => {
    const tasks = Array.from({ length: 955 }, (_, id) => ({
        uid: "owner",
        id: String(id),
        type: 3,
        state: 0,
        num: 0,
    }));
    const story = Array.from({ length: 73 }, (_, id) => ({
        uid: "owner",
        id,
        type: 1,
        state: 0,
        num: 0,
    }));
    const calls: Row[][] = [];
    const tx = {
        insert()
        {
            return {
                values(rows: Row[])
                {
                    return {
                        async onConflictDoUpdate()
                        {
                            calls.push(rows);
                            await Bun.sleep(2);
                        },
                    };
                },
            };
        },
    } as unknown as MutationTransaction;
    const write = { tasks, story };
    await createRealmQuestRepository(tx, "owner").writeQuests(write);
    expect(calls.map((batch) => batch.length)).toEqual([256, 256, 256, 187, 73]);
    calls.length = 0;
    const before = {
        tasks,
        quests: {
            story,
            daily: [],
            legacy: [],
            fresh: {},
            lord: {},
            mixed: {},
            signIn: {},
            alliance: {},
        },
    };
    for (let stage = 0; stage < 9; stage++)
    {
        await createRealmQuestRepository(tx, "owner").writeQuests(structuredClone(write), before);
    }
    expect(calls).toHaveLength(0);
    const changed = structuredClone(write);
    changed.tasks[0]!.state = 1;
    await createRealmQuestRepository(tx, "owner").writeQuests(changed, before);
    expect(calls).toEqual([[changed.tasks[0]!]]);
});

test("invalid rows are rejected before filtering or batching", async () => {
    const row = { uid: "other", id: "1", state: 0, num: 0 };
    await expect(
        createRealmQuestRepository({} as MutationTransaction, "owner").writeQuests(
            { tasks: [row] },
            { tasks: [row] },
        ),
    ).rejects.toThrow("Invalid quest write");
});
