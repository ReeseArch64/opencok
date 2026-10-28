import type { createDatabases } from "@opencok/drizzle";
import type {
    MailSystemQuery,
    MailSystemInspector,
    MailCategorySnapshot,
} from "@opencok/contracts/mail";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { DependencyError } from "@opencok/errors/dependency";
import { and, asc, eq, gte, inArray, isNull, or, sql } from "drizzle-orm";
import { readMailSenders, readMailTranslations } from "./mail-presentation.ts";

export function readSystemMail(
    databases: ReturnType<typeof createDatabases>,
    kingdomId: number,
    uid: string,
    query: MailSystemQuery,
    inspect: MailSystemInspector,
): Promise<MailCategorySnapshot>
{
    if (
        !uid
        || uid.length > 40
        || uid.includes("\0")
        || !uid.isWellFormed()
        || !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || !Number.isSafeInteger(query.now)
        || query.now < 0
        || typeof query.time !== "bigint"
        || BigInt.asIntN(64, query.time) !== query.time
        || (query.anchor !== null
            && (typeof query.anchor !== "string"
                || query.anchor.length > 40
                || query.anchor.includes("\0")
                || !query.anchor.isWellFormed()))
        || typeof inspect !== "function"
    )
    {
        throw new DependencyError("system mail input");
    }

    return databases.getKingdom(kingdomId).db.transaction(
        async (tx) => {
            const [profile] = await tx
                .select({
                    uid: userprofile.uid,
                    serverId: userprofile.serverId,
                    banTime: userprofile.banTime,
                    banFlag: userprofile.banFlag,
                })
                .from(userprofile)
                .where(eq(userprofile.uid, uid))
                .limit(1);

            if (
                !profile
                || profile.uid !== uid
                || profile.serverId !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(query.now)
            )
            {
                return { profile };
            }

            let after: bigint | undefined;

            if (query.anchor !== null)
            {
                const [anchor] = await tx
                    .select({ createTime: mail.createTime })
                    .from(mail)
                    .where(and(eq(mail.uid, query.anchor), eq(mail.toUser, uid)))
                    .limit(1);
                after = anchor?.createTime ?? (query.time > 0n ? query.time : undefined);
            }

            const selection = and(
                eq(mail.toUser, uid),
                after === undefined ? undefined : gte(mail.createTime, after),
            );
            const extraOwner = and(
                eq(mail_contents.uid, mail.uid),
                or(
                    eq(mail_contents.toUser, uid),
                    eq(mail_contents.toUser, ""),
                    isNull(mail_contents.toUser),
                ),
            );
            const order = [asc(mail.createTime), asc(sql`${mail.uid} collate "C"`)];
            const sizes = await tx
                .select({
                    uid: mail.uid,
                    size: sql<
                        number
                    >`coalesce(octet_length(${mail.contents}), 0) + coalesce(octet_length(${mail_contents.contents}), 0) + coalesce(octet_length(${mail.rewardId}), 0)`,
                })
                .from(mail)
                .leftJoin(mail_contents, extraOwner)
                .where(selection)
                .orderBy(...order)
                .limit(1001);

            if (
                sizes.length > 1000
                || new Set(sizes.map((row) => row.uid)).size !== sizes.length
                || sizes.some((row) => !Number.isSafeInteger(row.size) || row.size < 0)
                || sizes.reduce((sum, row) => sum + row.size, 0) > 4 * 1024 * 1024
            )
            {
                throw new DependencyError("system mail capacity");
            }

            const entries = sizes.length
                ? await tx
                    .select({
                        uid: mail.uid,
                        toUser: mail.toUser,
                        fromUser: mail.fromUser,
                        fromName: mail.fromName,
                        title: mail.title,
                        rewardId: mail.rewardId,
                        rewardStatus: mail.rewardStatus,
                        status: mail.status,
                        itemIdFlag: mail.itemIdFlag,
                        saveFlag: mail.saveFlag,
                        reply: mail.reply,
                        translationId: mail.translationId,
                        type: mail.type,
                        createTime: mail.createTime,
                        contents: mail.contents,
                        extra: mail_contents.contents,
                    })
                    .from(mail)
                    .leftJoin(mail_contents, extraOwner)
                    .where(
                        and(
                            eq(mail.toUser, uid),
                            inArray(
                                mail.uid,
                                sizes.map((row) => row.uid),
                            ),
                        ),
                    )
                    .orderBy(...order)
                : [];

            if (
                entries.length !== sizes.length
                || entries.some(
                    (row, index) =>
                        row.uid !== sizes[index]?.uid
                        || row.toUser !== uid
                        || (row.contents?.length ?? 0)
                                    + (row.extra?.length ?? 0)
                                    + Buffer.byteLength(row.rewardId ?? "")
                            !== sizes[index]?.size,
                )
            )
            {
                throw new DependencyError("system mail snapshot");
            }

            await inspect(entries, {
                senders: (uids) => readMailSenders(databases, kingdomId, tx, uids),
                translations: (requests) => readMailTranslations(tx, requests),
            });

            return { profile };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
