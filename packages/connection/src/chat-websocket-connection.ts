import type { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import type { RawData, WebSocket } from "ws";
import type { Connection, Frame, IncomingFrame, Peer } from "@opencok/contracts/chat";
import type { ChatWebsocketOptions } from "@opencok/contracts/chat-websocket-options";
import { isRecord, isSafeInteger } from "@opencok/contracts/chat";
import { AsyncDeadline } from "@opencok/core/async-deadline";
import { logEvent } from "@opencok/core/logging";
import { ChatCommandError } from "@opencok/errors/chat";

export class ChatWebSocketConnection implements Peer {
  public readonly connection: Connection = { joinedRooms: new Set<string>() };
  private readonly clientIdentity = { server: "local", clientid: randomUUID() };
  private readonly bootstrap = new Set(["user.setInfo", "user.init", "user.setDevice"]);
  private readonly deadline = new AsyncDeadline(3_000, "chat dependency timeout");
  private readonly token: unknown;
  private queued = 0;
  private queue = Promise.resolve();

  public constructor(
    private readonly socket: WebSocket,
    request: IncomingMessage,
    public readonly uid: string,
    private readonly options: ChatWebsocketOptions,
    private readonly peers: Set<Peer>,
  ) {
    this.token = request.headers.session;
    peers.add(this);

    const connectionId = this.clientIdentity.clientid;
    logEvent("connection_opened", { component: "chat.websocket", connectionId });
    this.sendFrame({ cmd: "login.success", data: {} });

    socket.on("close", () => {
      peers.delete(this);
      logEvent("connection_closed", { component: "chat.websocket", connectionId });
    });
    socket.on("error", () => {
      options.log?.({
        correlationId: randomUUID(),
        operation: "websocket.socket",
        category: "socket_error",
      });
    });
    socket.on("message", this.receive);
  }

  public readonly sendFrame = (frame: Frame): void => {
    if (this.socket.readyState !== this.socket.OPEN) return;

    const encoded = JSON.stringify({ ...frame, ...this.clientIdentity });

    if (this.socket.bufferedAmount + Buffer.byteLength(encoded) > 262_144) {
      this.socket.close(1013, "Reconnect and resync history");

      return;
    }

    this.socket.send(encoded);
  };

  public readonly authorizeSession = async (closeOnFailure = true): Promise<boolean> => {
    if (!(this.options.isReady ?? (() => true))()) return false;

    const identity = await this.deadline.run(() => this.options.verifyToken(this.token, this.uid));

    if (identity?.uid !== this.uid) {
      if (closeOnFailure) this.socket.close(1008, "Session unavailable");

      return false;
    }

    return true;
  };

  private readonly receive = (raw: RawData, binary: boolean) => {
    const socket = this.socket;
    const { handlers = {}, log = () => {} } = this.options;
    const { uid, connection, sendFrame, authorizeSession, peers } = this;
    const connectionId = this.clientIdentity.clientid;

    if (++this.queued > 32) {
      socket.close(1013, "Reconnect and resync history");
      this.queued--;

      return;
    }

    this.queue = this.queue
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
          const result = await this.deadline.run(async () => {
            if (!(await authorizeSession(false))) throw new ChatCommandError("unauthorized");

            if (this.bootstrap.has(frame.cmd)) return { status: "ok" };

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
        this.queued--;
      });
  };
}
