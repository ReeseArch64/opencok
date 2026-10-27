import { chat_message } from "@opencok/drizzle/schema/opencok_chat/chat_message";
import { createHash } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { decode, str } from "@opencok/messages/sfs";
import type { ChatRepository } from "@opencok/contracts/chat";
import type { Database } from "./game.ts";

export function createChatNoticePublisher(
  databases: Database["databases"],
  repository: ChatRepository,
  now: () => Date,
) {
  return async (
    owner: string,
    realm: number,
    operationId: string,
  ): Promise<Record<string, unknown>> => {
    const kingdom = databases.kingdoms.get(realm);
    const state = await repository.getPlayerStateById(owner);

    if (!kingdom || state?.serverId !== realm) throw new Error("Notice owner unavailable");

    const [event] = await kingdom.db
      .select()
      .from(mutation_outbox)
      .where(
        and(
          eq(mutation_outbox.kingdomId, realm),
          eq(mutation_outbox.ownerUid, owner),
          eq(mutation_outbox.requestId, operationId),
          eq(mutation_outbox.eventId, "notice"),
          eq(mutation_outbox.eventType, "social.notice"),
        ),
      )
      .limit(1);
    const [receipt] = await kingdom.db
      .select()
      .from(command_receipt)
      .where(
        and(
          eq(command_receipt.kingdomId, realm),
          eq(command_receipt.ownerUid, owner),
          eq(command_receipt.requestId, operationId),
        ),
      )
      .limit(1);

    if (!event || !receipt || !["chat.notice", "chat.original.notice"].includes(receipt.command))
      throw new Error("Notice receipt missing");

    if (event.payload.length === 0) throw new Error("Notice payload unavailable");

    const data = decode(event.payload);
    const createdAt = Number(receipt.createdAt);

    if (!Number.isSafeInteger(createdAt) || createdAt > now().getTime() + 60_000)
      throw new Error("Invalid notice receipt time");

    const key = `notice-${realm}-${operationId}`;
    const messageKey = key.length <= 64 ? key : createHash("sha256").update(key).digest("hex");

    if (createdAt + 86_400_000 <= now().getTime()) {
      const [message] = await databases.global.db
        .select({ id: chat_message.sequence_id })
        .from(chat_message)
        .where(
          and(
            eq(chat_message.sender_uid, owner),
            eq(chat_message.room_key, str(data, "roomId")),
            eq(chat_message.idempotency_key, Buffer.from(messageKey)),
          ),
        )
        .limit(1);

      return { expired: true, delivered: !!message };
    }

    if (repository.access && !(await repository.access.canSend(owner, true)))
      throw new Error("Notice sender muted");

    const saved = await repository.messages.create({
      roomId: str(data, "roomId"),
      senderUid: owner,
      idempotencyKey: key.length <= 64 ? key : createHash("sha256").update(key).digest("hex"),
      body: str(data, "msg"),
      now: new Date(createdAt),
      post: 6,
    });

    return { seqId: saved.sequenceId };
  };
}
