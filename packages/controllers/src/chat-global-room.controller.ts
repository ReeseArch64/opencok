import type { CommandContext, RoomAuthorizer } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatCommandController } from "./chat-command.controller.ts";

export class ChatGlobalRoomController extends ChatCommandController {
  public readonly command = ChatCommand.GlobalRoom;

  public constructor(private readonly authorizeRoom: RoomAuthorizer) {
    super();
  }

  public async execute({ uid }: CommandContext) {
    const room = await this.authorizeRoom(uid, "global_public");
    if (!room) throw new ChatCommandError("invalid_room");

    return { group: room.group, id: room.roomId };
  }
}
