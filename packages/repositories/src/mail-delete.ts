import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { alliance_invite_move } from "@opencok/drizzle/schema/opencok_kingdom/alliance_invite_move";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, desc, eq, inArray, isNull, ne, or, sql } from "drizzle-orm";
import type {
    MailDeletePlanner,
    MailDeleteQuery,
    MailDeleteSnapshot,
} from "@opencok/contracts/mail";
import type { Database } from "./game.ts";

export function deleteMail(
    db: Database["kingdom"]["db"],
    kingdomId: number,
    uid: string,
    query: MailDeleteQuery,
    plan: MailDeletePlanner,
): Promise<MailDeleteSnapshot>
{
    if (
        !uid.trim()
        || uid.length > 40
        || uid.includes("\0")
        || !uid.isWellFormed()
        || !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || !Number.isSafeInteger(query.now)
        || query.now < 0
        || query.ids.length > 1000
        || new Set(query.ids).size !== query.ids.length
        || typeof plan !== "function"
        || query.ids.some(
            (id) =>
                typeof id !== "string"
                || !id.length
                || id.length > 40
                || id.includes("\0")
                || !id.isWellFormed(),
        )
    )
    {
        throw new Error("Invalid mail delete query");
    }

    return db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        serverId: userprofile.serverId,
                        banTime: userprofile.banTime,
                        banFlag: userprofile.banFlag,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, uid))
                    .limit(1)
                    .for("update")
            )[0];

            if (
                !profile
                || profile.uid !== uid
                || profile.serverId !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(query.now)
                || !query.ids.length
            )
            {
                return { profile, deleted: 0 };
            }

            const deleted = await tx
                .delete(mail)
                .where(
                    and(
                        eq(mail.toUser, uid),
                        inArray(mail.uid, query.ids),
                        eq(mail.saveFlag, 0),
                        ne(mail.rewardStatus, 0),
                    ),
                )
                .returning({
                    uid: mail.uid,
                    type: mail.type,
                    fromUser: mail.fromUser,
                    contents: sql<
                        Buffer | null
                    >`case when ${mail.type} = 26 then ${mail.contents} else null end`,
                });

            if (!deleted.length)
            {
                return { profile, deleted: 0 };
            }

            const ids = deleted.map((row) => row.uid);
            const invitationIds = deleted.filter((row) => row.type === 26).map((row) => row.uid);
            const extraOwner = or(
                eq(mail_contents.toUser, uid),
                eq(mail_contents.toUser, ""),
                isNull(mail_contents.toUser),
            );
            const extra = invitationIds.length
                ? await tx
                    .select({
                        uid: mail_contents.uid,
                        contents: sql<
                            Buffer | null
                        >`case when octet_length(${mail_contents.contents}) <= 65535 then ${mail_contents.contents} else null end`,
                    })
                    .from(mail_contents)
                    .where(and(inArray(mail_contents.uid, invitationIds), extraOwner))
                : [];
            const contents = new Map(extra.map((entry) => [entry.uid, entry.contents]));
            const entries = deleted.map((entry) => ({
                ...entry,
                extra: contents.get(entry.uid) ?? null,
            }));

            if (
                entries.reduce(
                    (size, entry) =>
                        size + (entry.contents?.length ?? 0) + (entry.extra?.length ?? 0),
                    0,
                )
                    > 8 * 1024 * 1024
            )
            {
                throw new Error("Mail deletion metadata exceeds limit");
            }

            const cleanup = plan(entries);
            await tx.delete(mail_contents).where(and(inArray(mail_contents.uid, ids), extraOwner));
            await tx
                .insert(mail_update)
                .values(
                    ids.map((mailUid) => ({ toUser: uid, mailUid, updateTime: BigInt(query.now) })),
                )
                .onConflictDoUpdate({
                    target: [mail_update.toUser, mail_update.mailUid],
                    set: {
                        updateTime: sql`greatest(${mail_update.updateTime}, excluded."updateTime")`,
                    },
                });

            for (const group of cleanup.groups)
            {
                const key = and(
                    eq(mail_group.uid, uid),
                    eq(mail_group.groupType, group.groupType),
                    eq(mail_group.groupIndex, group.groupIndex),
                );
                const newest = group.types.length
                    ? (
                        await tx
                            .select({ createTime: mail.createTime })
                            .from(mail)
                            .where(
                                and(
                                    eq(mail.toUser, uid),
                                    inArray(mail.type, group.types),
                                    group.fromUser === undefined
                                        ? undefined
                                        : eq(mail.fromUser, group.fromUser),
                                ),
                            )
                            .orderBy(desc(mail.createTime))
                            .limit(1)
                    )[0]
                    : undefined;

                if (newest)
                {
                    await tx.update(mail_group).set({ updateTime: newest.createTime }).where(key);
                }
                else
                {
                    await tx.delete(mail_group).where(key);
                }
            }

            if (cleanup.inviters.length)
            {
                await tx
                    .delete(alliance_invite_move)
                    .where(
                        and(
                            eq(alliance_invite_move.invitee, uid),
                            inArray(alliance_invite_move.inviter, cleanup.inviters),
                        ),
                    );
            }

            return { profile, deleted: ids.length };
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
