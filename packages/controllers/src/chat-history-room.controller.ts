import type { CommandContext, RoomHandlerOptions } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatHistoryController } from "./chat-history.controller.ts";

export class ChatHistoryRoomController extends ChatHistoryController
{
    public readonly command = ChatCommand.HistoryRoom;

    public constructor(options: RoomHandlerOptions)
    {
        super(options);
    }

    public async execute(context: CommandContext)
    {
        const { uid, params } = context;
        const { roomId, start, end } = params;

        if (!isSafeInteger(start) || start < 0 || !isSafeInteger(end) || end <= start)
        {
            throw new ChatCommandError("invalid_time");
        }

        const room = await this.requireRoom(context, roomId);
        const raw = await this.options.messages.getAllByRange(room.roomId, start, end);
        const items = await this.visibleMessages(uid, raw);

        return { msg: items.map((item) => this.mapper.map(item, room.group)) };
    }
}
