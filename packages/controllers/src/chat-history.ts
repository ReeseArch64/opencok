import type { CommandHandlers, RoomHandlerOptions } from "@opencok/contracts/chat";
import { ChatHistoryCursorController } from "./chat-history-cursor.controller.ts";
import { ChatHistoryRoomController } from "./chat-history-room.controller.ts";
import { ChatHistoryRoomsController } from "./chat-history-rooms.controller.ts";

export function createHistoryHandlers(options: RoomHandlerOptions): CommandHandlers {
  const controllers = [
    new ChatHistoryCursorController(options),
    new ChatHistoryRoomsController(options),
    new ChatHistoryRoomController(options),
  ];

  return Object.fromEntries(
    controllers.map((controller) => [controller.command, controller.handle]),
  );
}
