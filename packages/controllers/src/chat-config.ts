import type { HttpHandler } from "@opencok/contracts/chat";
import type { ChatDiscoverySettings } from "@opencok/contracts/chat-discovery-settings";
import { ChatConfigController } from "./chat-config.controller.ts";
import { ChatServerListController } from "./chat-server-list.controller.ts";

export function createConfigHandler(settings: ChatDiscoverySettings): HttpHandler {
  return new ChatConfigController(settings).handle;
}

export function createServerListHandler(settings: ChatDiscoverySettings): HttpHandler {
  return new ChatServerListController(settings).handle;
}
