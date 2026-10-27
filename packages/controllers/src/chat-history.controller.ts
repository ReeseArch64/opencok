import type { ChatMessage, RoomHandlerOptions } from "@opencok/contracts/chat";
import { ChatMessageMapper } from "@opencok/mappings/chat-message.mapper";
import { ChatRoomController } from "./chat-room.controller.ts";

export abstract class ChatHistoryController extends ChatRoomController {
  protected constructor(
    options: RoomHandlerOptions,
    protected readonly mapper = new ChatMessageMapper(),
  ) {
    super(options);
  }

  protected async visibleMessages(uid: string, messages: ChatMessage[]): Promise<ChatMessage[]> {
    const visible: ChatMessage[] = [];

    for (const message of messages)
      {if (!this.options.access || (await this.options.access.canRead(uid, message)))
        {visible.push(message);}}

    return visible;
  }
}
