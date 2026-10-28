import { createServer, type Server } from "node:http";
import type { ChatHttpOptions } from "@opencok/contracts/chat-http-options";
import { ChatHttpHandler } from "./chat-http-handler.ts";

export class ChatHttpServer
{
    public readonly server: Server;

    public constructor(options: ChatHttpOptions = {})
    {
        this.server = createServer(new ChatHttpHandler(options).handle);
        this.server.requestTimeout = 4_000;
        this.server.headersTimeout = 5_000;
        options.websocketGateway?.attach(this.server);
    }
}
