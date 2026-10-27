import type { CommandContext, RoomHandlerOptions } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatHistoryController } from "./chat-history.controller.ts";

export class ChatHistoryRoomsController extends ChatHistoryController {
  public readonly command = ChatCommand.HistoryRooms;

  public constructor(options: RoomHandlerOptions) {
    super(options);
  }

  public async execute(context: CommandContext) {
    const { uid, params } = context;
    const requested = params.rooms;

    if (
      !requested ||
      typeof requested !== "object" ||
      Array.isArray(requested) ||
      Object.keys(requested).length > 16
    )
      {throw new ChatCommandError("invalid_room");}

    const rooms = [];

    for (const [roomId, afterMs] of Object.entries(requested)) {
      if (!/^(original_|country_|alliance_|global_|local_|private_[a-f0-9-]{36}$)/.test(roomId))
        {continue;}

      if (!isSafeInteger(afterMs) || afterMs < 0) {throw new ChatCommandError("invalid_time");}

      const room = await this.requireRoom(context, roomId);
      const raw = await this.options.messages.getAll(roomId, afterMs);
      const items = await this.visibleMessages(uid, raw);
      const first = items[0];
      const last = items.at(-1);

      rooms.push({
        roomId,
        group: room.group,
        firstMsgTime: first ? Date.parse(first.createdAt) : 0,
        lastMsgTime: last ? Date.parse(last.createdAt) : 0,
        firstSeqId: first?.sequenceId ?? 0,
        lastSeqId: last?.sequenceId ?? 0,
        msgs: items.map((item) => this.mapper.map(item, room.group)),
      });
    }

    return { rooms };
  }
}
