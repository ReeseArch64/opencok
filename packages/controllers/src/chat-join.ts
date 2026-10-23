import type { CommandHandler, Room, RoomAuthorizer } from "@opencok/contracts/chat";
import { isRecord } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/controllers/chat-rooms";

const supportedGroups = new Set(["original", "country", "alliance", "global", "local"]);

export function createJoinHandler(authorizeRoom: RoomAuthorizer): CommandHandler {
  return async ({ uid, params, connection }) => {
    if (!Array.isArray(params.rooms) || params.rooms.length > 16)
      throw new ChatCommandError("invalid_room");
    const accepted: Room[] = [];
    for (const item of params.rooms) {
      if (!isRecord(item) || typeof item.group !== "string" || typeof item.id !== "string") {
        throw new ChatCommandError("invalid_room");
      }
      if (!supportedGroups.has(item.group)) continue;
      const room = await authorizeRoom(uid, item.id);
      if (!room || room.group !== item.group) throw new ChatCommandError("invalid_room");
      accepted.push(room);
    }
    if (accepted.length === 0) throw new ChatCommandError("invalid_room");
    for (const room of accepted) connection.joinedRooms.add(room.roomId);
    return {
      status: true,
      id: accepted
        .filter((room) => room.group === "global" || room.group === "local")
        .map((room) => room.roomId),
      ids: [],
    };
  };
}
