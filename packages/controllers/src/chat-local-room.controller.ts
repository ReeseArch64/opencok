import type { CommandContext, RoomAuthorizer } from "@opencok/contracts/chat";
import { ChatCommand } from "@opencok/enums/chat-command";
import { ChatCommandError } from "@opencok/errors/chat";
import { ChatCommandController } from "./chat-command.controller.ts";

export class ChatLocalRoomController extends ChatCommandController {
  public readonly command = ChatCommand.LocalRoom;

  public constructor(private readonly authorizeRoom: RoomAuthorizer) {
    super();
  }

  public async execute({ uid, params }: CommandContext) {
    const lang = params.lang;
    if (typeof lang !== "string" || !/^[a-z]{2,3}(?:[-_][a-zA-Z]{2,4})?$/.test(lang))
      throw new ChatCommandError("invalid_language");

    const room = await this.authorizeRoom(uid, `local_${lang}`);
    if (!room) throw new ChatCommandError("invalid_room");

    return { group: room.group, id: room.roomId };
  }
}
