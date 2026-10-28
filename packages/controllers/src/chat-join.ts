import type { CommandContext, CommandHandler, Room, RoomAuthorizer } from "@opencok/contracts/chat";
import { isRecord } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatRoomGroup } from "@opencok/enums/chat-room-group";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatCommandController } from "./chat-command.controller.ts";

export class ChatJoinController extends ChatCommandController
{
    public readonly command = ChatCommand.JoinRooms;

    public constructor(private readonly authorizeRoom: RoomAuthorizer)
    {
        super();
    }

    public async execute({ uid, params, connection }: CommandContext)
    {
        if (!Array.isArray(params.rooms) || params.rooms.length > 16)
        {
            throw new ChatCommandError("invalid_room");
        }

        const accepted: Room[] = [];

        for (const item of params.rooms)
        {
            if (!isRecord(item) || typeof item.group !== "string" || typeof item.id !== "string")
            {
                throw new ChatCommandError("invalid_room");
            }

            if (!Object.values(ChatRoomGroup).some((group) => group === item.group))
            {
                continue;
            }

            const room = await this.authorizeRoom(uid, item.id);

            if (!room || room.group !== item.group)
            {
                throw new ChatCommandError("invalid_room");
            }

            accepted.push(room);
        }

        if (accepted.length === 0)
        {
            throw new ChatCommandError("invalid_room");
        }

        for (const room of accepted)
        {
            connection.joinedRooms.add(room.roomId);
        }

        return {
            status: true,
            id: accepted
                .filter((room) =>
                    room.group === ChatRoomGroup.Global || room.group === ChatRoomGroup.Local
                )
                .map((room) => room.roomId),
            ids: [],
        };
    }
}

export function createJoinHandler(authorizeRoom: RoomAuthorizer): CommandHandler
{
    return new ChatJoinController(authorizeRoom).handle;
}
