import { and, eq, inArray } from "drizzle-orm";
import { alliance_help } from "@opencok/drizzle/schema/opencok_kingdom/alliance_help";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import type { AllianceHelpWrite } from "../contracts/help";
import type { AllianceTransaction } from "../contracts/persistence";
import type { AllianceHelpPersistenceRuntime } from "../contracts/help-runtime";

export class AllianceHelpRepository
{
    public constructor(
        private readonly tx: AllianceTransaction,
        private readonly participants: readonly string[],
        private readonly runtime: AllianceHelpPersistenceRuntime,
    )
    {}

    public static async readGroups(tx: AllianceTransaction, groups: string[])
    {
        return groups.length
            ? await tx
                .select()
                .from(alliance_help)
                .where(inArray(alliance_help.allianceId, groups))
                .limit(4097)
            : [];
    }

    public static readPublication(tx: AllianceTransaction, id: string)
    {
        return tx
            .select()
            .from(alliance_help)
            .where(eq(alliance_help.allianceId, id))
            .limit(4096);
    }

    public static invalidateSender(tx: AllianceTransaction, id: string)
    {
        return tx.update(alliance_help).set({ isvalid: 0 }).where(eq(alliance_help.senderId, id));
    }

    public static invalidateAlliance(tx: AllianceTransaction, id: string)
    {
        return tx.update(alliance_help).set({ isvalid: 0 }).where(eq(alliance_help.allianceId, id));
    }

    public async write(write: AllianceHelpWrite)
    {
        const { tx, participants } = this;
        const { text, long, check } = this.runtime;

        for (const row of write.helps ?? [])
        {
            check(row);

            if (!participants.includes(text(row, "senderId")))
            {
                throw new Error("Foreign help sender");
            }

            const value = row as typeof alliance_help.$inferInsert;
            await tx
                .insert(alliance_help)
                .values(value)
                .onConflictDoUpdate({ target: alliance_help.helpId, set: value });
        }

        for (const row of write.queues ?? [])
        {
            if (!participants.includes(text(row, "ownerId")))
            {
                throw new Error("Foreign helped queue");
            }

            await tx
                .update(queue)
                .set({ updateTime: long(row, "updateTime"), isHelped: Number(row.isHelped) })
                .where(
                    and(eq(queue.uuid, text(row, "uuid")), eq(queue.ownerId, text(row, "ownerId"))),
                );
        }

        for (const row of write.activities ?? [])
        {
            if (!participants.includes(text(row, "ownerId")))
            {
                throw new Error("Foreign helped activity");
            }

            const updated = await tx
                .update(timed_activity)
                .set({ dueAt: long(row, "dueAt"), version: Number(row.version) })
                .where(
                    and(
                        eq(timed_activity.id, text(row, "id")),
                        eq(timed_activity.version, Number(row.version) - 1),
                        eq(timed_activity.status, 0),
                    ),
                )
                .returning({ id: timed_activity.id });

            if (updated.length !== 1)
            {
                throw new Error("Helped activity changed");
            }
        }
    }
}
