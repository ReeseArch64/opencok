import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_update } from "@opencok/drizzle/schema/opencok_kingdom/mail_update";
import { mail_gift_opening } from "@opencok/drizzle/schema/opencok_kingdom/mail_gift_opening";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, eq, inArray, sql } from "drizzle-orm";
import type { MailReadQuery, MailReadSnapshot } from "@opencok/contracts/mail";
import type { Database } from "./game.ts";

export function markMailRead(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  uid: string,
  query: MailReadQuery,
): Promise<MailReadSnapshot> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    uid.includes("\0") ||
    !uid.isWellFormed() ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    kingdomId > 2147483647 ||
    !Number.isSafeInteger(query.now) ||
    query.now < 0 ||
    typeof query.batch !== "boolean" ||
    (!query.batch && query.ids.length !== 1) ||
    query.ids.length > 1000 ||
    new Set(query.ids).size !== query.ids.length ||
    query.ids.some(
      (id) => typeof id !== "string" || id.length > 40 || id.includes("\0") || !id.isWellFormed(),
    )
  )
    throw new Error("Invalid mail read query");

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
        !profile ||
        profile.uid !== uid ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(query.now) ||
        !query.ids.length
      )
        return { profile };

      const changed = await tx
        .update(mail)
        .set({ status: 1 })
        .where(
          and(
            eq(mail.toUser, uid),
            inArray(mail.uid, query.ids),
            query.batch ? undefined : sql`coalesce(${mail.status}, 0) = 0`,
          ),
        )
        .returning({ uid: mail.uid, type: mail.type, createTime: mail.createTime });

      if (changed.length)
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
            set: { updateTime: sql`greatest(${mail_update.updateTime}, excluded."updateTime")` },
          });

      const gifts = query.batch ? [] : changed.filter((row) => row.type === 28);

      if (gifts.length)
        await tx
          .insert(mail_gift_opening)
          .values(
            gifts.map((row) => ({
              mailUid: row.uid,
              sendTime: row.createTime,
              toUser: uid,
              openedAt: BigInt(query.now),
            })),
          )
          .onConflictDoNothing({ target: [mail_gift_opening.mailUid, mail_gift_opening.sendTime] });

      return { profile };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
