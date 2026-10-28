import type { CommandContext, CommandHandler, RoomHandlerOptions } from "@opencok/contracts/chat";
import { isSafeInteger } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatRoomController } from "./chat-room.controller.ts";

export class ChatSendController extends ChatRoomController
{
    public readonly command = ChatCommand.SendRoomMessage;

    public constructor(options: RoomHandlerOptions)
    {
        super(options);
    }

    public async execute({ uid, params, sendTime, connection, peers }: CommandContext)
    {
        const { authorizeRoom, messages, access } = this.options;
        const roomId = params.roomId;

        if (typeof roomId !== "string" || !connection.joinedRooms.has(roomId))
        {
            throw new ChatCommandError("invalid_room");
        }

        const room = await authorizeRoom(uid, roomId);

        if (!room)
        {
            throw new ChatCommandError("invalid_room");
        }

        if (
            !isSafeInteger(sendTime)
            || sendTime <= 0
            || typeof params.msg !== "string"
            || (params.type !== undefined && params.type !== 0 && params.type !== 1)
        )
        {
            throw new ChatCommandError("invalid_message");
        }

        if (access && !(await access.canSend(uid)))
        {
            throw new ChatCommandError("chat_muted");
        }

        let saved;

        try
        {
            saved = await messages.create({
                roomId,
                senderUid: uid,
                idempotencyKey: String(sendTime),
                body: params.msg,
                now: new Date(),
            });
        }
        catch (error)
        {
            if (error instanceof TypeError)
            {
                throw new ChatCommandError("invalid_message");
            }

            throw error;
        }

        if (saved.inserted && !messages.durableDelivery)
        {
            const data = {
                sender: uid,
                msg: saved.body,
                serverTime: Date.parse(saved.createdAt),
                sendTime,
                group: room.group,
                roomId,
                seqId: saved.sequenceId,
                extra: { seqId: saved.sequenceId },
            };

            for (const peer of peers)
            {
                if (!peer.connection.joinedRooms.has(roomId))
                {
                    continue;
                }

                try
                {
                    if (
                        (!peer.authorizeSession || (await peer.authorizeSession()))
                        && (await authorizeRoom(peer.uid, roomId))
                    )
                    {
                        peer.sendFrame({ cmd: "push.chat.room", data });
                    }
                }
                catch
                {
                }
            }
        }

        return {
            roomId,
            group: room.group,
            serverTime: Date.parse(saved.createdAt),
            seqId: saved.sequenceId,
        };
    }
}

export function createSendHandler(options: RoomHandlerOptions): CommandHandler
{
    return new ChatSendController(options).handle;
}
