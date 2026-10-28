import { createRealmQuestRepository } from "../src/composition/quest-persistence";

import type { MutationTransaction } from "@opencok/repositories/mutation";
import type { Row } from "@opencok/contracts/rows";

const latencyMs = 2;
const stages = 9;
const tasks = Array.from({ length: 955 }, (_, id) => ({
    uid: "synthetic",
    id: String(id),
    type: 3,
    state: 0,
    num: 0,
}));
const story = Array.from({ length: 73 }, (_, id) => ({
    uid: "synthetic",
    id,
    type: 1,
    state: 0,
    num: 0,
}));
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

async function measure(batched: boolean)
{
    let queries = 0;
    let rows = 0;
    let databaseMs = 0;
    const execute = async (values: readonly Row[]) => {
        const start = performance.now();
        await Bun.sleep(latencyMs);
        databaseMs += performance.now() - start;
        queries++;
        rows += values.length;
    };
    const tx = {
        insert()
        {
            return {
                values(values: Row[])
                {
                    return { onConflictDoUpdate: () => execute(values) };
                },
            };
        },
    } as unknown as MutationTransaction;
    const start = performance.now();

    for (let stage = 0; stage < stages; stage++)
    {
        if (batched)
        {
            await createRealmQuestRepository(tx, "synthetic").writeQuests({ tasks, story }, before);
        }
        else
        {
            for (const row of [...tasks, ...story])
            {
                await execute([row]);
            }
        }
    }

    return {
        queries,
        writtenRows: rows,
        changedRows: 0,
        wallMs: Math.round(performance.now() - start),
        simulatedDatabaseMs: Math.round(databaseMs),
    };
}

console.log(
    JSON.stringify(
        {
            fixture: { tasks: tasks.length, story: story.length, stages, latencyMs },
            before: await measure(false),
            after: await measure(true),
        },
        null,
        2,
    ),
);
