import type { ChatMessage, RoomGroup } from "@opencok/contracts/chat";
import type { ChatMessageResponse } from "@opencok/contracts/responses/chat-message.response";

export class ChatMessageMapper {
  public map(item: ChatMessage, group: RoomGroup): ChatMessageResponse {
    return {
      sender: item.senderUid,
      msg: item.body,
      serverTime: Date.parse(item.createdAt),
      sendTime: Number(item.idempotencyKey) || 0,
      group,
      roomId: item.roomId,
      seqId: item.sequenceId,
      extra: { seqId: item.sequenceId },
    };
  }
}
