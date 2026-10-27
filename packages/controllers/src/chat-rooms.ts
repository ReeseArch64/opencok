import type { CommandHandlers, RoomAuthorizer } from "@opencok/contracts/chat";
import { ChatGlobalRoomController } from "./chat-global-room.controller.ts";
import { ChatLocalRoomController } from "./chat-local-room.controller.ts";

export { ChatCommandError } from "@opencok/errors/chat";

export function createRoomDiscovery(authorizeRoom: RoomAuthorizer): CommandHandlers {
  const global = new ChatGlobalRoomController(authorizeRoom);
  const local = new ChatLocalRoomController(authorizeRoom);

  return { [global.command]: global.handle, [local.command]: local.handle };
}
