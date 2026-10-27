import type { Duplex } from "node:stream";
import type { IncomingMessage, Server } from "node:http";
import { randomUUID } from "node:crypto";
import { WebSocketServer, type WebSocket } from "ws";
import type { Peer, WebSocketGateway } from "@opencok/contracts/chat";
import type { ChatWebsocketOptions } from "@opencok/contracts/chat-websocket-options";
import { AsyncDeadline } from "@opencok/core/async-deadline";
import { logEvent } from "@opencok/core/logging";
import { ChatWebSocketConnection } from "./chat-websocket-connection.ts";

export class ChatWebSocketGateway implements WebSocketGateway {
  public readonly peers = new Set<Peer>();
  private readonly wss = new WebSocketServer({
    noServer: true,
    maxPayload: 16_384,
    perMessageDeflate: false,
  });
  private readonly deadline = new AsyncDeadline(3_000, "chat dependency timeout");

  public constructor(private readonly options: ChatWebsocketOptions) {
    this.options = { ...options };
    this.wss.on("connection", (socket: WebSocket, request: IncomingMessage, uid: string) => {
      new ChatWebSocketConnection(socket, request, uid, this.options, this.peers);
    });
  }

  public attach(server: Server): void {
    server.on("upgrade", async (request, socket, head) => {
      if (request.url !== "/chat/ws") {
        this.rejectUpgrade(socket, 404);

        return;
      }

      let ready = false;

      try {
        ready = (this.options.isReady ?? (() => true))() === true;
      } catch {
        ready = false;
      }

      if (!ready) {
        this.rejectUpgrade(socket, 503);

        return;
      }

      const token = request.headers.session;
      const claimedUid = request.headers.uid;

      if (typeof token !== "string" || typeof claimedUid !== "string") {
        this.rejectUpgrade(socket, 401);

        return;
      }

      try {
        const identity = await this.deadline.run(() => this.options.verifyToken(token, claimedUid));

        if (!identity) {
          this.rejectUpgrade(socket, 401);

          return;
        }

        if (!socket.destroyed)
          {this.wss.handleUpgrade(request, socket, head, (ws) =>
            this.wss.emit("connection", ws, request, identity.uid),
          );}
      } catch {
        this.options.log?.({
          correlationId: randomUUID(),
          operation: "websocket.upgrade",
          category: "auth_unavailable",
        });
        this.rejectUpgrade(socket, 503);
      }
    });
  }

  public async close(): Promise<void> {
    for (const socket of this.wss.clients) {socket.terminate();}

    await new Promise<void>((resolve, reject) =>
      this.wss.close((error) => (error ? reject(error) : resolve())),
    );
  }

  private rejectUpgrade(socket: Duplex, status: number) {
    logEvent(
      "websocket_upgrade_rejected",
      { component: "chat.websocket", operationId: randomUUID(), status, outcome: "failure" },
      status >= 500 ? "error" : "warn",
    );
    socket.end(
      `HTTP/1.1 ${status} ${status === 401 ? "Unauthorized" : status === 503 ? "Service Unavailable" : "Not Found"}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
    );
  }
}
