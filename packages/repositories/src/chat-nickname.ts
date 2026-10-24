import { and, eq } from "drizzle-orm";
import { chat_avatar_profile } from "@opencok/drizzle/schema/opencok_chat/chat_avatar_profile";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { nickname_change_receipt } from "@opencok/drizzle/schema/opencok_global/nickname_change_receipt";
import { validChatNickname, type ChatNicknameStore } from "@opencok/contracts/chat-nickname";
import type { Database } from "./game.ts";
import { nicknameAccountUid } from "./nickname-global.ts";

export function createChatNicknameStore(
  db: Database["databases"]["global"]["db"],
): ChatNicknameStore {
  return {
    async refresh(input) {
      const update = Object.freeze({ ...input });
      if (!validChatNickname(update)) throw new Error("Invalid chat nickname operation");
      return db.transaction(
        async (tx) => {
          const uid = await nicknameAccountUid(tx, update.owner);
          const [account] = await tx
            .select({ server: account_new.server, name: account_new.gameUserName })
            .from(account_new)
            .where(eq(account_new.gameUid, uid))
            .limit(1);
          const [receipt] = await tx
            .select()
            .from(nickname_change_receipt)
            .where(eq(nickname_change_receipt.operationId, update.operationId))
            .limit(1);
          if (
            !account ||
            account.server !== String(update.kingdomId) ||
            !receipt ||
            receipt.ownerUid !== update.owner ||
            receipt.kingdomId !== update.kingdomId ||
            typeof account.name !== "string" ||
            !account.name ||
            account.name.length > 200 ||
            account.name.includes("\0") ||
            !account.name.isWellFormed()
          )
            throw new Error("Chat nickname authority unavailable");
          const key = and(
            eq(chat_avatar_profile.owner_uid, update.owner),
            eq(chat_avatar_profile.kingdom_id, update.kingdomId),
          );
          const [profile] = await tx
            .select({ name: chat_avatar_profile.user_name })
            .from(chat_avatar_profile)
            .where(key)
            .limit(1)
            .for("update");
          if (!profile || profile.name === account.name) return "unchanged";
          const changed = await tx
            .update(chat_avatar_profile)
            .set({ user_name: account.name })
            .where(key)
            .returning({ owner: chat_avatar_profile.owner_uid });
          if (changed.length !== 1 || changed[0]!.owner !== update.owner)
            throw new Error("Chat nickname write failed");
          return "applied";
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
  };
}
