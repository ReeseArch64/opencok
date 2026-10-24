import { and, eq, sql } from "drizzle-orm";
import { chat_avatar_profile } from "@opencok/drizzle/schema/opencok_chat/chat_avatar_profile";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import {
  validAvatarProfile,
  type ChatAvatarProfileStore,
} from "@opencok/contracts/chat-avatar-profile";
import type { AvatarProfileUpdate } from "@opencok/contracts/files";
import type { Database } from "./game.ts";

function project(row: typeof chat_avatar_profile.$inferSelect): AvatarProfileUpdate {
  const value = {
    owner: row.owner_uid,
    kingdomId: row.kingdom_id,
    sequence: row.sequence,
    picVer: row.pic_ver,
    committedAt: row.committed_at,
    updatedAt: String(row.committed_at / 1000n),
    userName: row.user_name,
    platform: row.platform,
  };
  if (!validAvatarProfile(value)) throw new Error("Invalid stored chat avatar profile");
  return value;
}
export function createChatAvatarProfileStore(
  db: Database["databases"]["global"]["db"],
): ChatAvatarProfileStore {
  return {
    async publish(input) {
      const update = Object.freeze({ ...input });
      if (!validAvatarProfile(update)) throw new Error("Invalid chat avatar profile");
      return db.transaction(
        async (tx) => {
          const [account] = await tx
            .select({ uid: account_new.gameUid, server: account_new.server })
            .from(account_new)
            .where(eq(account_new.gameUid, update.owner))
            .limit(1)
            .for("update");
          if (
            !account ||
            account.uid !== update.owner ||
            account.server !== String(update.kingdomId)
          )
            throw new Error("Chat avatar profile owner unavailable");
          const key = and(
            eq(chat_avatar_profile.owner_uid, update.owner),
            eq(chat_avatar_profile.kingdom_id, update.kingdomId),
          );
          const [row] = await tx
            .select()
            .from(chat_avatar_profile)
            .where(key)
            .limit(1)
            .for("update");
          if (row) {
            const current = project(row);
            if (current.owner !== update.owner || current.kingdomId !== update.kingdomId)
              throw new Error("Invalid stored chat avatar profile");
            if (current.sequence > update.sequence) return "superseded";
            if (current.sequence === update.sequence) {
              if (
                current.picVer !== update.picVer ||
                current.committedAt !== update.committedAt ||
                current.userName !== update.userName ||
                current.platform !== update.platform
              )
                throw new Error("Conflicting chat avatar profile");
              return "unchanged";
            }
          }
          const values = {
            owner_uid: update.owner,
            kingdom_id: update.kingdomId,
            sequence: update.sequence,
            pic_ver: update.picVer,
            committed_at: update.committedAt,
            user_name: update.userName,
            platform: update.platform,
          };
          const changed = row
            ? await tx
                .update(chat_avatar_profile)
                .set(values)
                .where(key)
                .returning({ owner: chat_avatar_profile.owner_uid })
            : await tx
                .insert(chat_avatar_profile)
                .values(values)
                .returning({ owner: chat_avatar_profile.owner_uid });
          if (changed.length !== 1 || changed[0]!.owner !== update.owner)
            throw new Error("Chat avatar profile write failed");
          return "applied";
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
    async find(owner, kingdomId) {
      if (
        typeof owner !== "string" ||
        !/^[0-9]{1,20}$/.test(owner) ||
        !Number.isInteger(kingdomId) ||
        kingdomId < 1 ||
        kingdomId > 2147483647
      )
        throw new Error("Invalid chat avatar profile query");
      const [row] = await db
        .select({ profile: chat_avatar_profile })
        .from(chat_avatar_profile)
        .innerJoin(
          account_new,
          and(
            eq(account_new.gameUid, chat_avatar_profile.owner_uid),
            eq(account_new.server, sql<string>`cast(${chat_avatar_profile.kingdom_id} as text)`),
          ),
        )
        .where(
          and(
            eq(chat_avatar_profile.owner_uid, owner),
            eq(chat_avatar_profile.kingdom_id, kingdomId),
          ),
        )
        .limit(1);
      if (!row) return null;
      const value = project(row.profile);
      if (value.owner !== owner || value.kingdomId !== kingdomId)
        throw new Error("Invalid stored chat avatar profile");
      return value;
    },
  };
}
