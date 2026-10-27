import type { CommandContext, Room, RoomHandlerOptions } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatCommandController } from "./chat-command.controller.ts";

export abstract class ChatRoomController extends ChatCommandController {
  protected constructor(protected readonly options: RoomHandlerOptions) {
    super();
  }

  protected async requireRoom(context: CommandContext, roomId: unknown): Promise<Room> {
    if (typeof roomId !== "string" || !context.connection.joinedRooms.has(roomId))
      throw new ChatCommandError("invalid_room");

    const room = await this.options.authorizeRoom(context.uid, roomId);

    if (!room) throw new ChatCommandError("invalid_room");

    return room;
  }
}
