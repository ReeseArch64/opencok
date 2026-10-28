import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, eq, inArray, sql } from "drizzle-orm";
import type { MailSaveQuery, MailSaveSnapshot } from "@opencok/contracts/mail";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function saveMail(
    db: DatabaseClient<"kingdom">,
    kingdomId: number,
    uid: string,
    query: MailSaveQuery,
): Promise<MailSaveSnapshot>
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
        || !["save", "cancel", "batch"].includes(query.mode)
        || (query.flag !== 0 && query.flag !== 1)
        || (query.mode === "save" && query.flag !== 1)
        || (query.mode === "cancel" && query.flag !== 0)
        || (query.mode !== "batch" && query.ids.length !== 1)
        || query.ids.length > 1000
        || new Set(query.ids).size !== query.ids.length
        || query.ids.some(
            (id) =>
                typeof id !== "string" || id.length > 40 || id.includes("\0") || !id.isWellFormed(),
        )
    )
    {
        throw new Error("Invalid mailbox save query");
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
                return { profile, result: "unchanged" };
            }

            const changed = await tx
                .update(mail)
                .set({ saveFlag: query.flag })
                .where(
                    and(
                        eq(mail.toUser, uid),
                        inArray(mail.uid, query.ids),
                        query.mode === "save"
                            ? sql`coalesce(${mail.saveFlag}, 0) <= 0`
                            : query.mode === "cancel"
                            ? sql`coalesce(${mail.saveFlag}, 0) <> 0`
                            : undefined,
                    ),
                )
                .returning({ uid: mail.uid });

            if (changed.length)
            {
                await tx
                    .insert(mail_update)
                    .values(
                        changed.map((row) => ({
                            toUser: uid,
                            mailUid: row.uid,
                            updateTime: BigInt(query.now),
                        })),
                    )
                    .onConflictDoUpdate({
                        target: [mail_update.toUser, mail_update.mailUid],
                        set: {
                            updateTime:
                                sql`greatest(${mail_update.updateTime}, excluded."updateTime")`,
                        },
                    });
            }

            return {
                profile,
                result: query.mode === "batch" ? "save" : changed.length ? query.mode : "unchanged",
            };
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
