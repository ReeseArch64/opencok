import type {
    MailUpdateInspector,
    MailUpdateQuery,
    MailUpdateSnapshot,
} from "@opencok/contracts/mail-updates";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { DependencyError } from "@opencok/errors/dependency";
import { and, asc, eq, gte, lt, or } from "drizzle-orm";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

export function readMailUpdates(
    db: DatabaseClient<"kingdom">,
    kingdomId: number,
    uid: string,
    query: MailUpdateQuery,
    inspect: MailUpdateInspector,
): Promise<MailUpdateSnapshot>
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
        || typeof query.after !== "bigint"
        || BigInt.asIntN(64, query.after) !== query.after
        || typeof inspect !== "function"
    )
    {
        throw new DependencyError("mail updates input");
    }

    return db.transaction(
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
                .limit(1)
                .for("update");

            if (
                !profile
                || profile.uid !== uid
                || profile.serverId !== kingdomId
                || (profile.banTime ?? 0n) > BigInt(query.now)
                || (profile.banFlag ?? 0) !== 0
            )
            {
                return { profile };
            }

            const rows = await tx
                .select({
                    uid: mail_update.mailUid,
                    updateTime: mail_update.updateTime,
                    owner: mail.toUser,
                    status: mail.status,
                    rewardStatus: mail.rewardStatus,
                    saveFlag: mail.saveFlag,
                })
                .from(mail_update)
                .leftJoin(mail, eq(mail.uid, mail_update.mailUid))
                .where(and(eq(mail_update.toUser, uid), gte(mail_update.updateTime, query.after)))
                .orderBy(asc(mail_update.mailUid))
                .limit(10001);

            if (rows.length > 10000)
            {
                throw new DependencyError("mail updates limit");
            }

            await inspect(
                rows.map((row) => ({
                    uid: row.uid,
                    updateTime: row.updateTime,
                    flags: row.owner === uid
                        ? {
                            status: row.status ?? 0,
                            rewardStatus: row.rewardStatus ?? 0,
                            saveFlag: row.saveFlag ?? 0,
                        }
                        : null,
                })),
            );
            const foreign = rows.filter((row) => row.owner !== null && row.owner !== uid);

            for (let offset = 0; offset < foreign.length; offset += 500)
            {
                await tx
                    .delete(mail_update)
                    .where(
                        and(
                            eq(mail_update.toUser, uid),
                            or(
                                ...foreign
                                    .slice(offset, offset + 500)
                                    .map((row) =>
                                        and(
                                            eq(mail_update.mailUid, row.uid),
                                            eq(mail_update.updateTime, row.updateTime),
                                        )
                                    ),
                            ),
                        ),
                    );
            }

            await tx
                .delete(mail_update)
                .where(
                    and(
                        eq(mail_update.toUser, uid),
                        lt(mail_update.updateTime, query.after),
                        lt(mail_update.updateTime, BigInt.asIntN(64, query.after - 432000000n)),
                    ),
                );

            return { profile };
        },
        { isolationLevel: "repeatable read", accessMode: "read write" },
    );
}
