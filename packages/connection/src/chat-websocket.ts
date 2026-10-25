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
import { logEvent } from "@opencok/core/logging";

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
  logEvent(
    "websocket_upgrade_rejected",
    { component: "chat.websocket", operationId: randomUUID(), status, outcome: "failure" },
    status >= 500 ? "error" : "warn",
  );
  socket.end(
    `HTTP/1.1 ${status} ${status === 401 ? "Unauthorized" : status === 503 ? "Service Unavailable" : "Not Found"}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
  );
}

function send(socket: WebSocket, value: Frame) {
  if (socket.readyState !== socket.OPEN) return;
  const encoded = JSON.stringify(value);
  if (socket.bufferedAmount + Buffer.byteLength(encoded) > 262_144) {
    socket.close(1013, "Reconnect and resync history");
    return;
  }
  socket.send(encoded);
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

  wss.on("connection", (socket: WebSocket, request: IncomingMessage, uid: string) => {
    const clientIdentity = { server: "local", clientid: randomUUID() };
    const connection: Connection = { joinedRooms: new Set<string>() };
    const sendFrame = (frame: Frame) => send(socket, { ...frame, ...clientIdentity });
    const token = request.headers.session;
    const authorizeSession = async (closeOnFailure = true) => {
      if (!isReady()) return false;
      const identity = await withinTimeout(() => verifyToken(token, uid));
      if (identity?.uid !== uid) {
        if (closeOnFailure) socket.close(1008, "Session unavailable");
        return false;
      }
      return true;
    };
    const peer = { uid, connection, sendFrame, authorizeSession };
    peers.add(peer);
    const connectionId = clientIdentity.clientid;
    logEvent("connection_opened", { component: "chat.websocket", connectionId });
    sendFrame({ cmd: "login.success", data: {} });
    socket.on("close", () => {
      peers.delete(peer);
      logEvent("connection_closed", { component: "chat.websocket", connectionId });
    });
    socket.on("error", () => {
      log({ correlationId: randomUUID(), operation: "websocket.socket", category: "socket_error" });
    });
    let queued = 0;
    let queue = Promise.resolve();
    socket.on("message", (raw, binary) => {
      if (++queued > 32) {
        socket.close(1013, "Reconnect and resync history");
        queued--;
        return;
      }
      queue = queue
        .then(async () => {
          if (socket.readyState !== socket.OPEN) return;
          const started = performance.now();
          const operationId = randomUUID();
          const report = (operation: string, outcome: string, reason?: string) =>
            logEvent(
              "chat_command",
              {
                component: "chat.websocket",
                connectionId,
                operationId,
                operation,
                outcome,
                reason,
                durationMs: Math.round(performance.now() - started),
              },
              outcome === "success" ? "info" : reason === "unavailable" ? "error" : "warn",
            );
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
            report("unknown", "failure", "bad_frame");
            sendFrame({ cmd: "error", error: { code: "bad_frame" } });
            return;
          }

          const base = {
            cmd: frame.cmd,
            ...(isSafeInteger(frame.sendTime) ? { sendTime: frame.sendTime } : {}),
          };
          try {
            const result = await withinTimeout(async () => {
              if (!(await authorizeSession(false))) throw new ChatCommandError("unauthorized");
              if (bootstrap.has(frame.cmd)) return { status: "ok" };
              const handler = Object.hasOwn(handlers, frame.cmd) ? handlers[frame.cmd] : null;
              if (!handler) throw new ChatCommandError("unsupported_command");
              return handler({
                uid,
                params: frame.params,
                sendTime: frame.sendTime,
                sendFrame,
                connection,
                peers,
              });
            });
            sendFrame({ ...base, result });
            report(frame.cmd, "success");
          } catch (error) {
            const code = error instanceof ChatCommandError ? error.code : "unavailable";
            report(frame.cmd, "failure", code);
            log({ correlationId: randomUUID(), operation: frame.cmd, category: code });
            sendFrame({ ...base, error: { code } });
            if (code === "unauthorized") socket.close(1008, "Session unavailable");
          }
        })
        .finally(() => {
          queued--;
        });
    });
  });

  return {
    peers,
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
