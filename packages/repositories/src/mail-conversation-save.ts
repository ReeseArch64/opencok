import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, eq, inArray } from "drizzle-orm";
import type {
  MailConversationSaveQuery,
  MailConversationSaveSnapshot,
} from "@opencok/contracts/mail";
import type { Database } from "./game.ts";

function int(value: number): boolean {
  return Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;
}

export function saveMailConversation(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  uid: string,
  query: MailConversationSaveQuery,
): Promise<MailConversationSaveSnapshot> {
  if (
    !uid.trim() ||
    uid.length > 40 ||
    uid.includes("\0") ||
    !uid.isWellFormed() ||
    !int(kingdomId) ||
    kingdomId < 1 ||
    !Number.isSafeInteger(query.now) ||
    query.now < 0 ||
    !["none", "sender", "type"].includes(query.scope) ||
    (query.scope !== "none" && !int(query.flag)) ||
    (query.scope === "type" && !int(query.type)) ||
    (query.scope === "sender" &&
      (typeof query.moderation !== "boolean" ||
        typeof query.fromUser !== "string" ||
        query.fromUser.length > 40 ||
        query.fromUser.includes("\0") ||
        !query.fromUser.isWellFormed()))
  )
    throw new Error("Invalid conversation save query");
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
        query.scope === "none"
      )
        return { profile };
      await tx
        .update(mail)
        .set({ saveFlag: query.flag })
        .where(
          and(
            eq(mail.toUser, uid),
            query.scope === "sender"
              ? and(
                  eq(mail.fromUser, query.fromUser),
                  inArray(mail.type, query.moderation ? [23, 24] : [20, 21, 22]),
                )
              : eq(mail.type, query.type),
          ),
        );
      return { profile };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
