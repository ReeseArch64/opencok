import type { QuestRecord as Row } from "../contracts/records";
import { user_daily_task } from "@opencok/drizzle/schema/opencok_kingdom/user_daily_task";
import { sign_in } from "@opencok/drizzle/schema/opencok_kingdom/sign_in";
import { and, eq, sql } from "drizzle-orm";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { user_story_task } from "@opencok/drizzle/schema/opencok_kingdom/user_story_task";
import { user_new_daily_task } from "@opencok/drizzle/schema/opencok_kingdom/user_new_daily_task";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { user_14day_login } from "@opencok/drizzle/schema/opencok_kingdom/user_14day_login";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import type { QuestState, QuestWrite } from "../contracts/progression";
import type { QuestProgressionState as CityProgressionState } from "../contracts/quest";
import type { QuestTransaction, QuestPersistenceRuntime } from "../contracts/persistence";
import { QuestChanges } from "../rules/changes";

const questBatchSize = 256;

export class QuestRepository
{
    private readonly changes: QuestChanges;

    public constructor(
        private readonly tx: QuestTransaction,
        private readonly owner: string,
        private readonly runtime: QuestPersistenceRuntime,
    )
    {
        this.changes = new QuestChanges(runtime);
    }

    public async readTasks()
    {
        const { tx, owner } = this;

        return tx.select().from(user_task).where(eq(user_task.uid, owner));
    }

    public async readQuests(profile: Row, now: bigint): Promise<QuestState>
    {
        const { tx, owner } = this;
        const { text } = this.runtime;

        const legacy = await tx
            .select()
            .from(user_daily_task)
            .where(eq(user_daily_task.uid, owner))
            .limit(1025);
        const [fresh] = await tx.select().from(sign_in).where(eq(sign_in.uid, owner));
        const [lord] = await tx.select().from(user_lord).where(eq(user_lord.uid, owner));
        const [mixed] = await tx.select().from(user_mixed_info).where(
            eq(user_mixed_info.uid, owner),
        );
        const [signIn] = await tx
            .select()
            .from(user_14day_login)
            .where(and(eq(user_14day_login.uid, owner), eq(user_14day_login.type, 1)));
        const story = await tx
            .select()
            .from(user_story_task)
            .where(eq(user_story_task.uid, owner))
            .limit(4097);
        const daily = await tx
            .select()
            .from(user_new_daily_task)
            .where(eq(user_new_daily_task.uid, owner))
            .limit(257);
        let [guild] = await tx
            .select()
            .from(alliance)
            .where(eq(alliance.uid, text(profile, "allianceId")));

        if (guild && now / 86400000n > BigInt(guild.taskFlushTime ?? 0) / 86400000n)
        {
            const [flushed] = await tx
                .update(alliance)
                .set({ taskFlushTime: now, taskNum: 0, taskLimit: "" })
                .where(
                    and(
                        eq(alliance.uid, guild.uid),
                        sql`COALESCE(${alliance.taskFlushTime},0) < ${
                            (now / 86400000n) * 86400000n
                        }`,
                    ),
                )
                .returning();

            if (flushed)
            {
                guild = flushed;
            }
            else
            {
                [guild] = await tx
                    .select()
                    .from(alliance)
                    .where(eq(alliance.uid, text(profile, "allianceId")));
            }
        }

        if (story.length > 4096 || daily.length > 256 || legacy.length > 1024)
        {
            throw new Error("Oversized quest aggregate");
        }

        return {
            legacy,
            fresh: fresh ?? {},
            lord: lord ?? {},
            mixed: mixed ?? {},
            signIn: signIn ?? {},
            story,
            daily,
            alliance: guild ?? {},
        };
    }

    public async writeQuests(
        write: QuestWrite,
        before?: Pick<CityProgressionState, "tasks" | "quests">,
    )
    {
        const { tx, owner } = this;
        const { text, num, insertSystemMail } = this.runtime;

        for (const message of write.mail ?? [])
        {
            await insertSystemMail(
                tx,
                message,
                owner,
                message.uid.slice(0, 32),
                message.createTime,
                message.itemIdFlag ?? 1,
            );
        }

        for (const rows of [write.tasks, write.story, write.daily])
        {
            for (const row of rows ?? [])
            {
                if (
                    row.uid !== owner
                    || ![0, 1, 2].includes(num(row, "state"))
                    || !Number.isInteger(num(row, "num"))
                    || num(row, "num") < 0
                    || num(row, "num") > 2147483647
                )
                {
                    throw new Error("Invalid quest write");
                }
            }
        }

        write = {
            ...write,
            tasks: this.changes.changedQuestRows(write.tasks, before?.tasks),
            story: this.changes.changedQuestRows(write.story, before?.quests?.story),
            daily: this.changes.changedQuestRows(
                write.daily,
                write.resetDaily ? [] : before?.quests?.daily,
                true,
            ),
            legacy: this.changes.changedQuestRows(
                write.legacy,
                write.resetLegacy ? [] : before?.quests?.legacy,
            ),
        };

        if (write.fresh)
        {
            await tx
                .insert(sign_in)
                .values({ uid: owner, ...write.fresh })
                .onConflictDoUpdate({ target: sign_in.uid, set: write.fresh });
        }

        if (write.resetLegacy)
        {
            await tx.delete(user_daily_task).where(eq(user_daily_task.uid, owner));
        }

        const legacy = (write.legacy ?? []).map((row) => ({
            uid: owner,
            id: text(row, "id"),
            num: num(row, "num"),
            times: num(row, "times"),
        }));

        for (let offset = 0; offset < legacy.length; offset += questBatchSize)
        {
            await tx
                .insert(user_daily_task)
                .values(legacy.slice(offset, offset + questBatchSize))
                .onConflictDoUpdate({
                    target: [user_daily_task.uid, user_daily_task.id],
                    set: { num: sql`excluded.num`, times: sql`excluded.times` },
                });
        }

        if (write.legacyPeriod !== undefined)
        {
            await tx
                .insert(user_lord)
                .values({ uid: owner, dailyTaskFlushTime: write.legacyPeriod })
                .onConflictDoUpdate({
                    target: user_lord.uid,
                    set: { dailyTaskFlushTime: write.legacyPeriod },
                });
        }

        if (write.dailyClaims !== undefined)
        {
            await tx
                .insert(user_mixed_info)
                .values({ uid: owner, mdata: "", dailyTaskId: write.dailyClaims })
                .onConflictDoUpdate({
                    target: user_mixed_info.uid,
                    set: { dailyTaskId: write.dailyClaims },
                });
        }

        if (write.allianceBox)
        {
            const [profile] = await tx
                .execute(
                    sql`SELECT "allianceId" FROM opencok_kingdom.userprofile WHERE uid = ${owner}`,
                )
                .then((result) => result.rows);
            const [guild] = await tx
                .select()
                .from(alliance)
                .where(eq(alliance.uid, String(profile?.allianceId ?? "")))
                .for("update");

            if (
                !guild
                || BigInt(guild.taskFlushTime ?? 0) / 86400000n !== write.allianceBox.period
                || (guild.taskNum ?? 0) < write.allianceBox.threshold
            )
            {
                throw new Error("Stale alliance quest period");
            }

            const limits = new Map(
                (guild.taskLimit ?? "")
                    .split("|")
                    .filter(Boolean)
                    .map((pair) => {
                        const [id, count] = pair.split(";");

                        return [Number(id), Number(count)] as const;
                    }),
            );
            const count = limits.get(write.allianceBox.threshold) ?? 0;

            if (count >= (guild.maxMember ?? 0))
            {
                throw new Error("Alliance quest box limit reached");
            }

            limits.set(write.allianceBox.threshold, count + 1);
            await tx
                .update(alliance)
                .set({ taskLimit: [...limits].map(([id, count]) => `${id};${count}`).join("|") })
                .where(eq(alliance.uid, guild.uid));
        }

        const tasks = (write.tasks ?? []).map((row) => ({
            uid: owner,
            id: text(row, "id"),
            type: num(row, "type"),
            state: num(row, "state"),
            num: num(row, "num"),
        }));

        for (let offset = 0; offset < tasks.length; offset += questBatchSize)
        {
            await tx
                .insert(user_task)
                .values(tasks.slice(offset, offset + questBatchSize))
                .onConflictDoUpdate({
                    target: [user_task.uid, user_task.id],
                    set: {
                        type: sql`excluded.type`,
                        state: sql`excluded.state`,
                        num: sql`excluded.num`,
                    },
                });
        }

        const story = (write.story ?? []).map((row) => ({
            uid: owner,
            id: num(row, "id"),
            type: num(row, "type"),
            state: num(row, "state"),
            num: num(row, "num"),
        }));

        for (let offset = 0; offset < story.length; offset += questBatchSize)
        {
            await tx
                .insert(user_story_task)
                .values(story.slice(offset, offset + questBatchSize))
                .onConflictDoUpdate({
                    target: [user_story_task.uid, user_story_task.id],
                    set: {
                        type: sql`excluded.type`,
                        state: sql`excluded.state`,
                        num: sql`excluded.num`,
                    },
                });
        }

        if (write.resetDaily)
        {
            await tx.delete(user_new_daily_task).where(eq(user_new_daily_task.uid, owner));
        }

        const daily = (write.daily ?? []).map((row) => ({
            uid: owner,
            id: num(row, "id"),
            type: num(row, "type"),
            state: num(row, "state"),
            num: num(row, "num"),
        }));

        for (let offset = 0; offset < daily.length; offset += questBatchSize)
        {
            await tx
                .insert(user_new_daily_task)
                .values(daily.slice(offset, offset + questBatchSize))
                .onConflictDoUpdate({
                    target: [
                        user_new_daily_task.uid,
                        user_new_daily_task.id,
                        user_new_daily_task.type,
                    ],
                    set: { state: sql`excluded.state`, num: sql`excluded.num` },
                });
        }

        if (write.lord)
        {
            await tx
                .insert(user_lord)
                .values({ uid: owner, ...write.lord })
                .onConflictDoUpdate({ target: user_lord.uid, set: write.lord });
        }

        if (write.signIn)
        {
            await tx
                .insert(user_14day_login)
                .values({ uid: owner, type: 1, ...write.signIn })
                .onConflictDoUpdate({
                    target: [user_14day_login.uid, user_14day_login.type],
                    set: write.signIn,
                });
        }

        if (write.taskStage !== undefined)
        {
            await tx
                .insert(user_mixed_info)
                .values({ uid: owner, mdata: "", taskStage: write.taskStage })
                .onConflictDoUpdate({
                    target: user_mixed_info.uid,
                    set: { taskStage: write.taskStage },
                });
        }

        if (write.allianceTasks)
        {
            const rows = await tx.execute(
                sql`UPDATE opencok_kingdom.alliance SET "taskNum" = COALESCE("taskNum",0) + ${write.allianceTasks} WHERE uid = (SELECT "allianceId" FROM opencok_kingdom.userprofile WHERE uid = ${owner}) RETURNING uid`,
            );

            if (rows.rowCount !== 1)
            {
                throw new Error("Missing quest alliance");
            }
        }
    }
}
