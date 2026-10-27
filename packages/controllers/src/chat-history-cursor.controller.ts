import type { CommandContext, RoomHandlerOptions } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatHistoryController } from "./chat-history.controller.ts";

export class ChatHistoryCursorController extends ChatHistoryController {
  public readonly command = ChatCommand.HistoryCursor;

  public constructor(options: RoomHandlerOptions) {
    super(options);
  }

  public async execute(context: CommandContext) {
    const { uid, params } = context;
    const room = await this.requireRoom(context, params.roomId);
    const { messages } = this.options;

    if (
      !messages.page ||
      !isSafeInteger(params.before) ||
      params.before < 0 ||
      typeof params.archive !== "boolean"
    )
      {throw new ChatCommandError("invalid_cursor");}

    const page = await messages.page({
      roomId: room.roomId,
      before: params.before,
      limit: 100,
      archive: params.archive,
    });
    const items = await this.visibleMessages(uid, page.messages);

    return { msgs: items.map((item) => this.mapper.map(item, room.group)), cursor: page.cursor };
  }
}
