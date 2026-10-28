import { and, eq, asc } from "drizzle-orm";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import type { QuestTransaction } from "../contracts/persistence";
import type { QuestRecord } from "../contracts/records";
import type { ReconnectTaskPlan } from "../contracts/reconnect";
import type { ReconnectTaskPersistenceRuntime } from "../contracts/reconnect-runtime";

export class ReconnectTaskRepository
{
    public constructor(
        private readonly tx: QuestTransaction,
        private readonly uid: string,
        private readonly runtime: ReconnectTaskPersistenceRuntime,
    )
    {}

    public static readTasks(tx: QuestTransaction, uid: string)
    {
        return tx
            .select()
            .from(user_task)
            .where(eq(user_task.uid, uid))
            .orderBy(asc(user_task.id))
            .limit(32768);
    }

    public async writeTasks(
        state: readonly QuestRecord[],
        write: Pick<ReconnectTaskPlan, "inserts" | "updates">,
    ): Promise<void>
    {
        const { tx, uid } = this;
        const { integer, unique, updated } = this.runtime;

        unique(write.inserts.map((task) => task.id));
        unique(write.updates.map((task) => task.id));
        const inserted = new Set(write.inserts.map((task) => task.id));

        for (const task of [...write.inserts, ...write.updates])
        {
            if (![0, 1].includes(integer(task.state)))
            {
                throw new Error("Reconnect cannot claim tasks");
            }

            integer(task.num);
            integer(task.type);
        }

        for (const task of write.inserts)
        {
            if (state.some((row) => row.id === task.id))
            {
                throw new Error("Reconnect task already exists");
            }

            await tx
                .insert(user_task)
                .values({ uid, id: task.id, num: task.num, state: task.state, type: task.type });
        }

        for (const task of write.updates)
        {
            if (inserted.has(task.id))
            {
                continue;
            }

            if (!state.some((row) => row.id === task.id && integer(row.state) === 0))
            {
                throw new Error("Invalid reconnect task transition");
            }

            updated(
                await tx
                    .update(user_task)
                    .set({ num: task.num, state: task.state })
                    .where(
                        and(
                            eq(user_task.uid, uid),
                            eq(user_task.id, task.id),
                            eq(user_task.state, 0),
                        ),
                    )
                    .returning({ id: user_task.id }),
            );
        }
    }
}
