import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { eq, sql } from "drizzle-orm";
import type { MailStatusQuery, MailStatusSnapshot } from "@opencok/contracts/mail";
import type { Database } from "./game.ts";

export function readMailStatus(
  db: Database["kingdom"]["db"],
  uid: string,
  query: MailStatusQuery,
): Promise<MailStatusSnapshot> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    !Number.isSafeInteger(query.now) ||
    (query.category !== undefined &&
      (!Number.isInteger(query.category) ||
        query.category < -2147483648 ||
        query.category > 2147483647))
  )
    throw new Error("Invalid mailbox status query");
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
      )[0];
      if (
        !profile ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(query.now) ||
        (query.category !== undefined && (query.category < 1 || query.category > 8))
      )
        return { profile, counts: [] };
      const status = sql<number>`coalesce(${mail.status}, 0)`;
      const allianceNotice = sql<boolean>`${mail.title} = '115429'`;
      const counts = await tx
        .select({
          type: mail.type,
          status,
          allianceNotice,
          count: sql<string>`count(*)::text`.mapWith(BigInt),
        })
        .from(mail)
        .where(eq(mail.toUser, uid))
        .groupBy(mail.type, status, allianceNotice)
        .limit(32768);
      if (counts.length > 32767) throw new Error("Mailbox status groups exceed limit");
      return { profile, counts };
    },
    { isolationLevel: "repeatable read", accessMode: "read only" },
  );
}
