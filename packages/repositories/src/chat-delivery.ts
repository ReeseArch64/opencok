import { isRecord } from "@opencok/contracts/chat";
import { and, asc, eq, gt, lte, sql } from "drizzle-orm";
import { chat_consumer, chat_event } from "@opencok/drizzle/schema/opencok_chat/chat_social";
import { chat_mailbox_message } from "@opencok/drizzle/schema/opencok_chat/chat_mailbox_message";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import type { ChatDeliveryStore } from "@opencok/contracts/chat-delivery";
import type { Frame } from "@opencok/contracts/chat";
import { chatMessage } from "./chat-messages.ts";
import type { Database } from "./game.ts";

export function createChatDeliveryStore(
  db: Database["databases"]["global"]["db"],
  clock: () => Date,
): ChatDeliveryStore {
  const now = () => BigInt(clock().getTime());

  return {
    async acquire(instance, token) {
      if (!/^[a-zA-Z0-9_-]{1,100}$/.test(instance)) throw new TypeError("Invalid chat instance");

      await db.transaction(async (tx) => {
        await tx.execute(
          sql`select pg_advisory_xact_lock(hashtextextended(${`chat:consumer:${instance}`},0))`,
        );
        const [old] = await tx.select().from(chat_consumer).where(eq(chat_consumer.id, instance));

        if (old && old.token !== token && old.leaseUntil > now())
          throw new Error("Chat instance already active");

        await tx
          .insert(chat_consumer)
          .values({
            id: instance,
            token,
            cursor: old?.cursor ?? 0n,
            leaseUntil: now() + 15_000n,
            updatedAt: now(),
          })
          .onConflictDoUpdate({
            target: chat_consumer.id,
            set: { token, leaseUntil: now() + 15_000n, updatedAt: now() },
          });
      });
    },
    async poll(instance, token, limit = 100) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 100)
        throw new TypeError("Invalid delivery limit");

      const [previous] = await db
        .select()
        .from(chat_consumer)
        .where(eq(chat_consumer.id, instance));
      const [consumer] = await db
        .update(chat_consumer)
        .set({ leaseUntil: now() + 15_000n, updatedAt: now() })
        .where(
          and(
            eq(chat_consumer.id, instance),
            eq(chat_consumer.token, token),
            gt(chat_consumer.leaseUntil, now()),
          ),
        )
        .returning();

      if (!consumer) throw new Error("Chat distribution lease lost");

      const [oldest] = await db
        .select({ sequence: chat_event.sequence })
        .from(chat_event)
        .orderBy(asc(chat_event.sequence))
        .limit(1);
      const rows = await db
        .select()
        .from(chat_event)
        .where(gt(chat_event.sequence, consumer.cursor))
        .orderBy(asc(chat_event.sequence))
        .limit(limit);
      const events = [];

      for (const row of rows) {
        const [message] =
          row.message && row.kind === "message"
            ? await db
                .select()
                .from(chat_message)
                .where(eq(chat_message.sequence_id, BigInt(row.message)))
                .limit(1)
            : [];
        const [direct] =
          row.kind === "direct" && row.message
            ? await db
                .select()
                .from(chat_mailbox_message)
                .where(
                  and(
                    eq(chat_mailbox_message.message_id, row.message),
                    eq(chat_mailbox_message.owner_uid, row.target ?? ""),
                    gt(chat_mailbox_message.expires_at, now()),
                  ),
                )
                .limit(1)
            : [];
        events.push({
          sequence: String(row.sequence),
          id: row.id,
          roomId: row.room,
          owner: row.owner,
          target: row.target,
          message:
            row.expiresAt > now() &&
            message &&
            message.body !== null &&
            !message.deleted_at &&
            Date.parse(`${message.expires_at.replace(" ", "T")}Z`) > Number(now())
              ? chatMessage(message)
              : null,
          frame:
            row.expiresAt <= now()
              ? null
              : direct
                ? {
                    cmd: "push.chat",
                    data: {
                      id: direct.message_id,
                      senderUid: row.owner,
                      senderName:
                        isRecord(row.data) && typeof row.data.senderName === "string"
                          ? row.data.senderName
                          : row.owner,
                      type: 1,
                      msg: direct.body,
                      timeLong: Number(direct.created_at),
                    },
                  }
                : row.data
                  ? (row.data as Frame)
                  : null,
        });
      }

      return {
        events,
        resync:
          (!!oldest && consumer.cursor > 0n && oldest.sequence > consumer.cursor + 1n) ||
          (previous?.updatedAt ?? now()) < now() - 86_400_000n ||
          rows.some((row) => row.expiresAt <= now()),
      };
    },
    async acknowledge(instance, token, sequence) {
      if (!/^\d+$/.test(sequence)) throw new TypeError("Invalid delivery cursor");

      const rows = await db
        .update(chat_consumer)
        .set({ cursor: BigInt(sequence), updatedAt: now() })
        .where(
          and(
            eq(chat_consumer.id, instance),
            eq(chat_consumer.token, token),
            gt(chat_consumer.leaseUntil, now()),
            lte(chat_consumer.cursor, BigInt(sequence)),
          ),
        )
        .returning({ id: chat_consumer.id });

      if (!rows.length) throw new Error("Chat distribution lease lost");
    },
    async release(instance, token) {
      await db
        .update(chat_consumer)
        .set({ leaseUntil: 0n })
        .where(and(eq(chat_consumer.id, instance), eq(chat_consumer.token, token)));
    },
  };
}
