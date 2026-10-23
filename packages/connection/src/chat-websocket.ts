import type { Duplex } from "node:stream";
import type { IncomingMessage } from "node:http";
import type { WebSocket } from "ws";
import type {
  CommandHandlers,
  Connection,
  Frame,
  IncomingFrame,
  Log,
  Peer,
  TokenVerifier,
  WebSocketGateway,
} from "@opencok/contracts/chat";
import { isRecord, isSafeInteger } from "@opencok/contracts/chat";
import { randomUUID } from "node:crypto";

import { WebSocketServer } from "ws";

import { ChatCommandError } from "@opencok/controllers/chat-rooms";

const bootstrap = new Set(["user.setInfo", "user.init", "user.setDevice"]);
const dependencyTimeoutMs = 3_000;

async function withinTimeout<T>(operation: () => Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation(),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("chat dependency timeout")), dependencyTimeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

function rejectUpgrade(socket: Duplex, status: number) {
  socket.end(
    `HTTP/1.1 ${status} ${status === 401 ? "Unauthorized" : status === 503 ? "Service Unavailable" : "Not Found"}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
  );
}

function send(socket: WebSocket, value: Frame) {
  if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(value));
}

export function createWebSocketGateway({
  verifyToken,
  handlers = {},
  isReady = () => true,
  log = () => {},
}: {
  verifyToken: TokenVerifier;
  handlers?: CommandHandlers;
  isReady?: () => boolean;
  log?: Log;
}): WebSocketGateway {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 16_384, perMessageDeflate: false });
  const peers = new Set<Peer>();

  wss.on("connection", (socket: WebSocket, _request: IncomingMessage, uid: string) => {
    const clientIdentity = { server: "local", clientid: randomUUID() };
    const connection: Connection = { joinedRooms: new Set<string>() };
    const sendFrame = (frame: Frame) => send(socket, { ...frame, ...clientIdentity });
    const peer = { uid, connection, sendFrame };
    peers.add(peer);
    sendFrame({ cmd: "login.success", data: {} });
    socket.on("close", () => peers.delete(peer));
    socket.on("error", () => {
      log({ correlationId: randomUUID(), operation: "websocket.socket", category: "socket_error" });
    });
    socket.on("message", async (raw, binary) => {
      let frame: IncomingFrame;
      try {
        if (binary) throw new Error("binary frame");
        const parsed: unknown = JSON.parse(raw.toString());
        if (
          !isRecord(parsed) ||
          typeof parsed.cmd !== "string" ||
          !parsed.cmd ||
          !isRecord(parsed.params)
        )
          throw new Error("invalid frame");
        frame = { cmd: parsed.cmd, params: parsed.params, sendTime: parsed.sendTime };
      } catch {
        sendFrame({ cmd: "error", error: { code: "bad_frame" } });
        return;
      }

      const base = {
        cmd: frame.cmd,
        ...(isSafeInteger(frame.sendTime) ? { sendTime: frame.sendTime } : {}),
      };
      if (bootstrap.has(frame.cmd)) {
        sendFrame({ ...base, result: { status: "ok" } });
        return;
      }
      const handler = Object.hasOwn(handlers, frame.cmd) ? handlers[frame.cmd] : null;
      if (!handler) {
        sendFrame({ ...base, error: { code: "unsupported_command" } });
        return;
      }
      try {
        const result = await withinTimeout(() =>
          handler({
            uid,
            params: frame.params,
            sendTime: frame.sendTime,
            sendFrame,
            connection,
            peers,
          }),
        );
        sendFrame({ ...base, result });
      } catch (error) {
        const code = error instanceof ChatCommandError ? error.code : "unavailable";
        log({ correlationId: randomUUID(), operation: frame.cmd, category: code });
        sendFrame({ ...base, error: { code } });
      }
    });
  });

  return {
    attach(server) {
      server.on("upgrade", async (request, socket, head) => {
        if (request.url !== "/chat/ws") {
          rejectUpgrade(socket, 404);
          return;
        }
        let ready = false;
        try {
          ready = isReady() === true;
        } catch {
          ready = false;
        }
        if (!ready) {
          rejectUpgrade(socket, 503);
          return;
        }
        const token = request.headers.session;
        const claimedUid = request.headers.uid;
        if (typeof token !== "string" || typeof claimedUid !== "string") {
          rejectUpgrade(socket, 401);
          return;
        }
        try {
          const identity = await withinTimeout(() => verifyToken(token, claimedUid));
          if (!identity) {
            rejectUpgrade(socket, 401);
            return;
          }
          if (!socket.destroyed)
            wss.handleUpgrade(request, socket, head, (ws) =>
              wss.emit("connection", ws, request, identity.uid),
            );
        } catch {
          log({
            correlationId: randomUUID(),
            operation: "websocket.upgrade",
            category: "auth_unavailable",
          });
          rejectUpgrade(socket, 503);
        }
      });
    },
    async close() {
      for (const socket of wss.clients) socket.terminate();
      await new Promise<void>((resolve, reject) =>
        wss.close((error) => (error ? reject(error) : resolve())),
      );
    },
  };
}
