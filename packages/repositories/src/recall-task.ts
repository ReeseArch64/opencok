import { and, asc, eq, sql } from "drizzle-orm";
import { user_recall_task } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task";
import { user_recall_task_notes } from "@opencok/drizzle/schema/opencok_kingdom/user_recall_task_notes";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { text, long } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import type { RecallTaskWrite } from "@opencok/contracts/recall-task";
import type { MutationTransaction } from "./mutation";

export async function readRecallTasks(
    tx: MutationTransaction,
    owner: string,
    countryNeeded: boolean,
)
{
    const [notes] = await tx
        .select()
        .from(user_recall_task_notes)
        .where(eq(user_recall_task_notes.uid, owner))
        .for("update");
    const tasks = await tx
        .select()
        .from(user_recall_task)
        .where(eq(user_recall_task.uid, owner))
        .orderBy(asc(user_recall_task.id))
        .limit(65)
        .for("update");

    if (tasks.length > 64)
    {
        throw new Error("Recall task aggregate exceeds bound");
    }

    const [registration] = countryNeeded
        ? await tx
            .select({ country: stat_reg.country })
            .from(stat_reg)
            .where(eq(stat_reg.uid, owner))
            .orderBy(sql`case when ${stat_reg.type} = 2 then 0 else 1 end`, asc(stat_reg.type))
            .limit(1)
        : [];

    return { notes, tasks, country: registration?.country ?? "" };
}

export async function writeRecallTasks(
    tx: MutationTransaction,
    owner: string,
    write: RecallTaskWrite,
)
{
    if (write.notes)
    {
        const row = write.notes;

        if (
            row.uid !== owner
            || text(row, "version").length > 255
            || text(row, "country").length > 40
            || long(row, "endTime") < long(row, "beginTime")
        )
        {
            throw new Error("Invalid recall task notes");
        }

        const value = {
            uid: owner,
            version: text(row, "version"),
            receive_mode: cityInteger(row.receive_mode),
            refreshTime: cityAmount(row.refreshTime),
            beginTime: cityAmount(row.beginTime),
            opendTime: cityAmount(row.opendTime),
            country: text(row, "country"),
            endTime: cityAmount(row.endTime),
            lastLoginTime: cityAmount(row.lastLoginTime ?? 0n),
        };
        await tx
            .insert(user_recall_task_notes)
            .values(value)
            .onConflictDoUpdate({ target: user_recall_task_notes.uid, set: value });
    }

    if (
        (write.tasks?.length ?? 0) > 64
        || new Set(write.tasks?.map((row) => row.id)).size !== (write.tasks?.length ?? 0)
    )
    {
        throw new Error("Recall task writes exceed bound");
    }

    if (write.reset)
    {
        await tx.delete(user_recall_task).where(eq(user_recall_task.uid, owner));
    }

    for (const row of write.tasks ?? [])
    {
        if (row.uid !== owner || !text(row, "id") || text(row, "id").length > 255)
        {
            throw new Error("Foreign recall task");
        }

        const value = {
            uid: owner,
            id: text(row, "id"),
            num: cityInteger(row.num),
            target_num: cityInteger(row.target_num, 1),
            state: cityInteger(row.state, 0, 1),
            type_level: cityInteger(row.type_level),
            receive: cityInteger(row.receive, 0, 1),
        };

        if (write.reset)
        {
            await tx.insert(user_recall_task).values(value);
        }
        else
        {
            const updated = await tx
                .update(user_recall_task)
                .set(value)
                .where(and(eq(user_recall_task.uid, owner), eq(user_recall_task.id, value.id)))
                .returning({ id: user_recall_task.id });

            if (updated.length !== 1)
            {
                throw new Error("Stale recall task");
            }
        }
    }
}
