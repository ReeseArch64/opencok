import type { WebSocketGateway } from "@opencok/contracts/chat";
import type { ChatWebsocketOptions } from "@opencok/contracts/chat-websocket-options";
import { ChatWebSocketGateway } from "./chat-websocket-gateway.ts";

export function createWebSocketGateway(options: ChatWebsocketOptions): WebSocketGateway
{
    return new ChatWebSocketGateway(options);
}
