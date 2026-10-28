import { and, eq } from "drizzle-orm";
import { user_target_task } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task";
import { user_target_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_target_task_notes";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import type { TargetTaskWrite } from "../contracts/target-task";
import type { QuestTransaction } from "../contracts/persistence";
import type { TargetTaskPersistenceRuntime } from "../contracts/target-runtime";

export class TargetTaskRepository
{
    public constructor(
        private readonly tx: QuestTransaction,
        private readonly owner: string,
        private readonly runtime: TargetTaskPersistenceRuntime,
    )
    {}

    public async readTargetTasks()
    {
        const { tx, owner } = this;
        const { long } = this.runtime;

        const [notes] = await tx
            .select()
            .from(user_target_task_notes)
            .where(eq(user_target_task_notes.uid, owner))
            .for("update");
        const tasks = await tx
            .select()
            .from(user_target_task)
            .where(eq(user_target_task.uid, owner))
            .limit(65)
            .for("update");

        if (tasks.length > 64)
        {
            throw new Error("Too many target tasks");
        }

        const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));

        return { notes, tasks, openedAt: long(server ?? {}, "activityTime") };
    }

    public async writeTargetTasks(write: TargetTaskWrite)
    {
        const { tx, owner } = this;
        const { text, long, cityInteger, cityAmount } = this.runtime;

        if (write.notes)
        {
            const row = write.notes;

            if (
                row.uid !== owner
                || text(row, "version").length > 255
                || long(row, "endTime") < long(row, "beginTime")
            )
            {
                throw new Error("Invalid target task notes owner or period");
            }

            const value = {
                uid: owner,
                version: text(row, "version"),
                receive_mode: cityInteger(row.receive_mode, 0, 3),
                refreshTime: cityAmount(row.refreshTime),
                beginTime: cityAmount(row.beginTime),
                opendTime: cityAmount(row.opendTime),
                isMail: cityInteger(row.isMail, 0, 1),
                endTime: cityAmount(row.endTime),
            };
            await tx
                .insert(user_target_task_notes)
                .values(value)
                .onConflictDoUpdate({ target: user_target_task_notes.uid, set: value });
        }

        if (write.reset)
        {
            await tx.delete(user_target_task).where(eq(user_target_task.uid, owner));
        }

        if (
            (write.tasks?.length ?? 0) > 64
            || new Set(write.tasks?.map((row) => text(row, "id"))).size
                !== (write.tasks?.length ?? 0)
        )
        {
            throw new Error("Invalid target task writes");
        }

        for (const row of write.tasks ?? [])
        {
            if (row.uid !== owner || !text(row, "id") || text(row, "id").length > 255)
            {
                throw new Error("Invalid target task owner");
            }

            const value = {
                uid: owner,
                id: text(row, "id"),
                num: cityInteger(row.num),
                target_num: cityInteger(row.target_num, 1),
                state: cityInteger(row.state, 0, 1),
                type_level: cityInteger(row.type_level, 0, 4),
                rewardDouble: cityInteger(row.rewardDouble, 0, 999),
            };

            if (write.reset)
            {
                await tx.insert(user_target_task).values(value);
            }
            else
            {
                const updated = await tx
                    .update(user_target_task)
                    .set(value)
                    .where(and(eq(user_target_task.uid, owner), eq(user_target_task.id, value.id)))
                    .returning({ uid: user_target_task.uid });

                if (updated.length !== 1)
                {
                    throw new Error("Missing owned target task");
                }
            }
        }
    }
}
