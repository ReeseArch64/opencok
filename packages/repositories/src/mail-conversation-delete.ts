import { and, eq, inArray, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import type {
  MailConversationDeleteQuery,
  MailCategoryDeleteSnapshot,
} from "@opencok/contracts/mail";
import { enqueueMailChat } from "./mail-chat-intents.ts";
import type { Database } from "./game.ts";

export async function deleteMailConversations(
  db: Database["kingdom"]["db"],
  kingdomId: number,
  owner: string,
  query: MailConversationDeleteQuery,
): Promise<MailCategoryDeleteSnapshot> {
  if (
    !owner ||
    owner.length > 40 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < 1 ||
    !Number.isSafeInteger(query.now) ||
    query.now < 0 ||
    !Array.isArray(query.senders) ||
    query.senders.length > 1000 ||
    typeof query.moderation !== "boolean" ||
    typeof query.bottle !== "boolean" ||
    query.senders.some(
      (sender) =>
        sender !== null &&
        (typeof sender !== "string" ||
          sender.length > 40 ||
          sender.includes("\0") ||
          !sender.isWellFormed()),
    )
  )
    {throw new Error("Invalid conversation deletion");}

  query = { ...query, senders: [...query.senders] };

  return db.transaction(
    async (tx) => {
      const [profile] = await tx
        .select({
          uid: userprofile.uid,
          serverId: userprofile.serverId,
          banFlag: userprofile.banFlag,
          banTime: userprofile.banTime,
        })
        .from(userprofile)
        .where(eq(userprofile.uid, owner))
        .limit(1)
        .for("update");

      if (
        !profile ||
        profile.uid !== owner ||
        profile.serverId !== kingdomId ||
        (profile.banFlag ?? 0) !== 0 ||
        (profile.banTime ?? 0n) > BigInt(query.now)
      )
        {return { profile };}

      const senders = [...new Set(query.senders)];
      const chatTypes = query.moderation ? [2] : query.bottle ? [3] : [1, 20];
      await enqueueMailChat(
        tx,
        owner,
        query.now,
        senders.map((sender) => ({
          action: "delete",
          others: sender === null ? "null" : sender,
          types: chatTypes,
        })),
      );

      for (const sender of senders) {
        await tx
          .delete(mail)
          .where(
            and(
              eq(mail.toUser, owner),
              sender === null ? sql`${mail.fromUser} = ${null}` : eq(mail.fromUser, sender),
              inArray(
                mail.type,
                query.bottle ? [43, 44] : query.moderation ? [23, 24] : [20, 21, 22],
              ),
            ),
          );

        if (!query.bottle)
          {await tx
            .delete(mail_group)
            .where(
              and(
                eq(mail_group.uid, owner),
                eq(mail_group.groupType, query.moderation ? 500 : 100),
                sender === null
                  ? sql`${mail_group.groupIndex} = ${null}`
                  : eq(mail_group.groupIndex, sender),
              ),
            );}
      }

      return { profile };
    },
    { isolationLevel: "read committed", accessMode: "read write" },
  );
}
