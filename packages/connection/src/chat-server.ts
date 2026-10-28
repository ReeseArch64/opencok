import type { HttpHandler } from "@opencok/contracts/chat";
import type { ChatHttpOptions } from "@opencok/contracts/chat-http-options";
import { ChatHttpHandler } from "./chat-http-handler.ts";
import { ChatHttpServer } from "./chat-http-server.ts";

export function createChatHttpHandler(options: ChatHttpOptions = {}): HttpHandler
{
    return new ChatHttpHandler(options).handle;
}

export function createChatServer(options: ChatHttpOptions = {})
{
    return new ChatHttpServer(options).server;
}
