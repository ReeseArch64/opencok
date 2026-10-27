import type { ChatRepository, RoomAuthorizer } from "@opencok/contracts/chat";
import { ChatRoomGroup } from "@opencok/enums/chat-room-group";
import { ChatRoomAuthorizer } from "./chat-rooms.ts";

export class ChatRoomAccessAuthorizer {
  private readonly publicRooms: ChatRoomAuthorizer;

  public constructor(
    private readonly repository: Pick<ChatRepository, "access" | "getPlayerStateById">,
  ) {
    this.publicRooms = new ChatRoomAuthorizer(repository.getPlayerStateById);
  }

  public readonly authorize: RoomAuthorizer = async (uid, roomId) => {
    if (!roomId.startsWith("private_")) {return this.publicRooms.authorize(uid, roomId);}

    return (await this.repository.access?.privateRoom(uid, roomId)) &&
      (await this.repository.getPlayerStateById(uid))
      ? { group: ChatRoomGroup.Private, roomId }
      : null;
  };
}
