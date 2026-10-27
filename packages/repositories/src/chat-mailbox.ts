import { chat_mailbox_intent } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { createHash } from "node:crypto";
import { and, asc, desc, eq, gt, inArray, lte, or, isNull, sql } from "drizzle-orm";
import { chat_mailbox_message } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_message";
import { chat_mailbox_receipt } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_receipt";
import { encodeChatMailbox, type ChatMailboxStore } from "@opencok/contracts/chat-mailbox";
import type { Database } from "./game.ts";

export function createChatMailboxStore(
  db: Database["databases"]["global"]["db"],
  now = Date.now,
): ChatMailboxStore {
  return {
    async apply(input) {
      const encoded = encodeChatMailbox(input);
      const update = JSON.parse(encoded) as typeof input;
      const hash = createHash("sha256").update(encoded).digest("hex");

      return db.transaction(
        async (tx) => {
          await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended('chat:append',0))`);
          await tx.execute(
            sql`select pg_advisory_xact_lock(hashtextextended(${`mailbox:${update.kingdomId}:${update.owner}`}, 0))`,
          );
          const [receipt] = await tx
            .select()
            .from(chat_mailbox_receipt)
            .where(
              and(
                eq(chat_mailbox_receipt.kingdom_id, update.kingdomId),
                eq(chat_mailbox_receipt.operation_id, update.operationId),
                eq(chat_mailbox_receipt.effect_index, update.effectIndex),
              ),
            )
            .limit(1);

          if (receipt) {
            if (receipt.owner_uid !== update.owner || receipt.payload_hash !== hash)
              throw new Error("Conflicting chat mailbox replay");

            return "unchanged";
          }

          const selection = and(
            eq(chat_mailbox_message.kingdom_id, update.kingdomId),
            eq(chat_mailbox_message.owner_uid, update.owner),
            update.others === "" ? undefined : eq(chat_mailbox_message.peer_uid, update.others),
            inArray(chat_mailbox_message.chat_type, [...update.types]),
            lte(chat_mailbox_message.created_at, BigInt(update.requestedAt)),
          );

          if (update.action === "read")
            await tx.update(chat_mailbox_message).set({ read: true }).where(selection);
          else await tx.delete(chat_mailbox_message).where(selection);

          for (const type of update.types)
            await tx
              .insert(chat_mailbox_intent)
              .values({
                realm: update.kingdomId,
                owner: update.owner,
                operation: update.operationId,
                effect: update.effectIndex,
                peer: update.others,
                type,
                action: update.action,
                cutoff: BigInt(update.requestedAt),
              })
              .onConflictDoNothing();

          await tx.insert(chat_mailbox_receipt).values({
            kingdom_id: update.kingdomId,
            operation_id: update.operationId,
            effect_index: update.effectIndex,
            owner_uid: update.owner,
            payload_hash: hash,
            requested_at: BigInt(update.requestedAt),
          });

          return "applied";
        },
        { isolationLevel: "read committed", accessMode: "read write" },
      );
    },
    async list(owner, kingdomId, peer, type, limit) {
      if (
        !owner ||
        owner.length > 40 ||
        peer.length > 40 ||
        !Number.isInteger(kingdomId) ||
        kingdomId < 1 ||
        ![1, 2, 3, 20].includes(type) ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 1000
      )
        throw new Error("Invalid chat mailbox query");

      return db
        .select({
          id: chat_mailbox_message.message_id,
          peer: chat_mailbox_message.peer_uid,
          sender: chat_mailbox_message.sender_uid,
          type: chat_mailbox_message.chat_type,
          createdAt: chat_mailbox_message.created_at,
          body: chat_mailbox_message.body,
          read: chat_mailbox_message.read,
        })
        .from(chat_mailbox_message)
        .where(
          and(
            eq(chat_mailbox_message.kingdom_id, kingdomId),
            eq(chat_mailbox_message.owner_uid, owner),
            peer ? eq(chat_mailbox_message.peer_uid, peer) : undefined,
            eq(chat_mailbox_message.chat_type, type),
            or(
              isNull(chat_mailbox_message.expires_at),
              gt(chat_mailbox_message.expires_at, BigInt(now())),
            ),
          ),
        )
        .orderBy(desc(chat_mailbox_message.created_at), asc(chat_mailbox_message.message_id))
        .limit(limit);
    },
  };
}
