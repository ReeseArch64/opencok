import type { CommandHandlers, RoomAuthorizer } from "@opencok/contracts/chat";
import { ChatCommandError } from "@opencok/errors/chat";
export { ChatCommandError } from "@opencok/errors/chat";

export function createRoomDiscovery(authorizeRoom: RoomAuthorizer): CommandHandlers {
  return {
    "room.getGlobalRoom": async ({ uid }) => {
      const room = await authorizeRoom(uid, "global_public");
      if (!room) throw new ChatCommandError("invalid_room");
      return { group: room.group, id: room.roomId };
    },

    "room.getLocalRoom": async ({ uid, params }) => {
      const lang = params.lang;
      if (typeof lang !== "string" || !/^[a-z]{2,3}(?:[-_][a-zA-Z]{2,4})?$/.test(lang)) {
        throw new ChatCommandError("invalid_language");
      }
      const room = await authorizeRoom(uid, `local_${lang}`);
      if (!room) throw new ChatCommandError("invalid_room");
      return { group: room.group, id: room.roomId };
    },
  };
}
