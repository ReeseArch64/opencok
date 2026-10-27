import {
  MAX_CONNECTIONS,
  SOCKET_TIMEOUT_MS,
  MAX_PENDING_PACKETS,
  PAUSE_PENDING_PACKETS,
} from "@opencok/constants/connection";
import type { Socket } from "node:net";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { errorReason, logEvent, withLogContext } from "@opencok/core/logging";
import { text } from "@opencok/contracts/rows";
import { authenticate, LoginError } from "@opencok/identity/mobile";
import { heroResourceConfig } from "@opencok/mappings/bootstrap";
import { GameError } from "@opencok/errors/game";
import { FrameReader, frame, MAX_FRAME } from "@opencok/messages/frame";
import {
  envelope,
  encode,
  extension,
  fields,
  ProtocolError,
  sfs,
  str,
  Type,
  type Fields,
} from "@opencok/messages/sfs";

import type { ConnectionConfig, ServerDependencies } from "./dependencies.ts";

export interface ConnectionState {
  sockets: Set<Socket>;
  inFlight: Set<Promise<void>>;
  metrics: { userId: number; rejected: number; commands: number };
  ready(): boolean;
}

export function createSessionHandler(
  config: ConnectionConfig,
  dependencies: ServerDependencies,
  state: ConnectionState,
) {
  const { db, cache, game, world } = dependencies;
  const { sockets, inFlight, metrics, ready } = state;
  const sessions = new Map<string, { socket: Socket; token: string }>();
  return (socket: Socket) => {
    const connectionId = randomUUID();
    const connected = performance.now();
    let lastProfileObservation = Date.now();
    let closeReason = "peer_closed";
    const report = (
      event: string,
      fields: Record<string, string | number | boolean | undefined> = {},
      level: "info" | "warn" | "error" = "info",
    ) =>
      logEvent(
        event,
        { component: "tcp", kingdom: config.kingdomId, connectionId, ...fields },
        level,
      );
    if (sockets.size >= MAX_CONNECTIONS || !ready()) {
      report(
        "connection_rejected",
        { reason: sockets.size >= MAX_CONNECTIONS ? "connection_limit" : "not_ready" },
        "warn",
      );
      socket.destroy();
      return;
    }
    sockets.add(socket);
    report("connection_opened", { connections: sockets.size });
    socket.setTimeout(SOCKET_TIMEOUT_MS);
    socket.setNoDelay(true);
    const reader = new FrameReader();
    const token = randomBytes(24).toString("hex");
    let unsubscribe: (() => void) | undefined;
    let uid: string | undefined;
    let handshake = false;
    let initialized = false;
    let pending = 0;
    let chain = Promise.resolve();
    const send = (packet: Fields) => {
      if (socket.destroyed) return;
      const bytes = frame(packet);
      if (socket.writableLength + bytes.length > 4 * MAX_FRAME) {
        closeReason = "write_backpressure";
        report("connection_backpressure", { reason: closeReason }, "warn");
        socket.destroy();
        return;
      }
      socket.write(bytes);
    };
    const handle = async (packet: Fields) => {
      if (!ready()) {
        closeReason = "not_ready";
        report("connection_unavailable", { reason: closeReason }, "warn");
        socket.destroy();
        return;
      }
      if (packet.c?.type !== Type.Byte || packet.a?.type !== Type.Short) throw new ProtocolError();
      const controller = packet.c.value;
      const action = packet.a.value;
      const body = fields(packet.p);
      if (controller === 0 && action === 0) {
        if (handshake || str(body, "api").length > 64 || str(body, "cl", "").length > 512)
          throw new ProtocolError();
        handshake = true;
        report("handshake_completed", { outcome: "success" });
        send(
          envelope(0, 0, {
            tk: sfs.string(token),
            ct: sfs.int(MAX_FRAME + 1),
            ms: sfs.int(MAX_FRAME),
          }),
        );
        return;
      }
      if (!handshake) throw new ProtocolError();
      if (controller === 0 && action === 1) {
        if (uid) throw new ProtocolError();
        const started = performance.now();
        let claimed: string | undefined;
        let stage = "authentication";
        try {
          const profile = await authenticate(body, db, config);
          claimed = text(profile, "uid");
          stage = "session";
          const previous = sessions.get(claimed);
          if (previous) {
            report("session_replaced");
            previous.socket.destroy();
            await cache.release(claimed, previous.token);
          }
          if (!(await cache.claim(claimed, token))) throw new LoginError();
          sessions.set(claimed, { socket, token });
          stage = "initialization";
          const details = fields(body.p);
          await dependencies.profileSessions?.open(claimed, connectionId, Date.now());
          const initializedState = await game.initialize(claimed, details);
          const initial = initializedState.body;
          if (socket.destroyed || !ready()) {
            if (sessions.get(claimed)?.socket === socket) sessions.delete(claimed);
            await dependencies.profileSessions?.close(claimed, connectionId, Date.now());
            await cache.release(claimed, token);
            return;
          }
          uid = claimed;
          send(
            envelope(0, 1, {
              id: sfs.int(++metrics.userId),
              zn: sfs.string(`COK${config.kingdomId}`),
              un: sfs.string(uid),
              rs: sfs.short(0),
              pi: sfs.short(0),
              rl: sfs.array(),
              p: sfs.object({ use: sfs.int(0), ...heroResourceConfig() }),
            }),
          );
          if (details._cok_) initial._cok_ = details._cok_;
          send(extension("init", initial));
          for (const push of initializedState.pushes) send(extension(push.command, push.body));
          if (!socket.destroyed)
            unsubscribe = dependencies.notifications?.subscribe(
              uid,
              async (command, body, signal) => {
                if (
                  signal?.aborted ||
                  socket.destroyed ||
                  !ready() ||
                  sessions.get(claimed!)?.socket !== socket ||
                  !(await cache.refresh(claimed!, token))
                )
                  return false;
                if (
                  signal?.aborted ||
                  socket.destroyed ||
                  !ready() ||
                  sessions.get(claimed!)?.socket !== socket
                )
                  return false;
                send(extension(command, body));
                return !socket.destroyed;
              },
            );
          report("login_accepted", {
            initialization: "partial",
            outcome: "success",
            durationMs: Math.round(performance.now() - started),
          });
        } catch (error) {
          report(
            "login_rejected",
            {
              stage,
              durationMs: Math.round(performance.now() - started),
              outcome: "failure",
              reason:
                error instanceof LoginError
                  ? error.reason
                  : error instanceof GameError
                    ? (error.reason ?? "game_state")
                    : error instanceof ProtocolError
                      ? "protocol_shape"
                      : errorReason(error),
            },
            error instanceof LoginError ||
              error instanceof GameError ||
              error instanceof ProtocolError
              ? "warn"
              : "error",
          );
          if (claimed) {
            await dependencies.profileSessions
              ?.close(claimed, connectionId, Date.now())
              .catch(() =>
                report("session_cleanup_failed", { reason: "profile_session" }, "error"),
              );
            if (sessions.get(claimed)?.socket === socket) sessions.delete(claimed);
            await cache
              .release(claimed, token)
              .catch(() => report("session_cleanup_failed", { reason: "cache_release" }, "error"));
          }
          metrics.rejected++;
          send(
            envelope(0, 1, {
              ec: sfs.short(3),
              ep: { type: Type.StringArray, value: ["Login unavailable"] },
            }),
          );
        }
        return;
      }
      if (!uid) throw new ProtocolError();
      if (!(await cache.refresh(uid, token))) {
        closeReason = "session_expired";
        report("session_expired", { reason: closeReason }, "warn");
        socket.destroy();
        return;
      }
      const observed = Date.now();
      if (dependencies.profileSessions?.observe && observed - lastProfileObservation >= 60000) {
        await dependencies.profileSessions.observe(uid, connectionId, observed);
        lastProfileObservation = observed;
      }

      if (controller === 0 && action === 29) {
        send(envelope(0, 29, {}));
        return;
      }
      if (controller !== 1 || action !== 13) throw new ProtocolError();
      const command = str(body, "c");
      const params = fields(body.p);
      if (command.length > 128) throw new ProtocolError();
      metrics.commands++;
      const started = performance.now();
      const commandHash = createHash("sha256").update(command).digest("hex").slice(0, 16);
      const knownCommands = [
        "cmd.finishinit",
        "cmd.ping",
        "login.dataconfig",
        "setting.xml",
        "login.other",
        "build.info",
        "get.user.info.multi",
        "get.user.info",
        "get.power.info",
        "user.lv",
        "world.get",
      ];
      const commandFields = {
        command: knownCommands.includes(command) ? command : "unknown",
        commandHash,
      };
      let outcome = "success";
      let reason: string | undefined;
      try {
        if (command === "cmd.finishinit") {
          if (!initialized)
            report("client_init_acknowledged", {
              initialization: "partial",
              outcome: "success",
              durationMs: Math.round(performance.now() - started),
            });
          initialized = true;
          const result: Fields = {};
          if (params._cok_) result._cok_ = params._cok_;
          if (params.cmdBaseTime) result.cmdBaseTime = params.cmdBaseTime;
          send(extension(command, result));
        } else if (command === "world.get") {
          const result = await world.get(uid, params);
          if (params._cok_) result._cok_ = params._cok_;
          send(extension(command, result));
        } else {
          if (
            (command.startsWith("item.") ||
              command.startsWith("hot.item.") ||
              command.startsWith("comeback.") ||
              command === "mail.reward" ||
              command === "mail.reward.batch" ||
              command === "shoppingMall.buy" ||
              command === "activity.accept.reward" ||
              command === "redPackets.sd" ||
              command === "redPackets.rv" ||
              command === "trade.info" ||
              command === "trade.exchange" ||
              command === "trade.cancel") &&
            !params.operationId &&
            params._cok_
          ) {
            if (
              !(
                (params._cok_.type === Type.Int && Number.isInteger(params._cok_.value)) ||
                (params._cok_.type === Type.String &&
                  typeof params._cok_.value === "string" &&
                  params._cok_.value.length <= 128)
              )
            )
              throw new ProtocolError();
            const identity = createHash("sha256")
              .update(connectionId)
              .update(command)
              .update(encode({ _cok_: params._cok_ }))
              .digest("hex");
            params.operationId = sfs.string(
              `${identity.slice(0, 8)}-${identity.slice(8, 12)}-4${identity.slice(13, 16)}-8${identity.slice(17, 20)}-${identity.slice(20, 32)}`,
            );
          }
          const result = await game.execute(uid, command, params);
          for (const push of result.pushes) send(extension(push.command, push.body));
          send(extension(command, result.body));
        }
      } catch (error) {
        metrics.rejected++;

        outcome = "failure";
        reason = error instanceof GameError ? error.code : errorReason(error);
        report(
          "command_rejected",
          { ...commandFields, reason, outcome },
          error instanceof GameError ? "warn" : "error",
        );
        const result: Fields = {
          errorCode: sfs.string(error instanceof GameError ? error.code : "E100179"),
        };
        if (params._cok_) result._cok_ = params._cok_;
        if (params.cmdBaseTime) result.cmdBaseTime = params.cmdBaseTime;
        send(extension(command, result));
      } finally {
        report(
          "command_completed",
          {
            ...commandFields,
            outcome,
            reason,
            durationMs: Math.round(performance.now() - started),
          },
          outcome === "success" ? "info" : "warn",
        );
      }
    };
    socket.on("data", (data) => {
      try {
        for (const packet of reader.feed(Buffer.isBuffer(data) ? data : Buffer.from(data))) {
          if (++pending > MAX_PENDING_PACKETS) throw new ProtocolError();
          const operationId = randomUUID();
          chain = chain
            .then(async () => {
              try {
                if (!socket.destroyed)
                  await withLogContext(
                    { connectionId, operationId, kingdom: config.kingdomId, component: "tcp" },
                    () => handle(packet),
                  );
              } finally {
                pending--;
              }
            })
            .catch((error) => {
              closeReason = error instanceof ProtocolError ? "protocol_shape" : errorReason(error);
              report(
                "packet_rejected",
                { operationId, reason: closeReason },
                error instanceof ProtocolError ? "warn" : "error",
              );
              metrics.rejected++;
              socket.destroy();
            });
        }
        if (pending >= PAUSE_PENDING_PACKETS) socket.pause();
        const task = chain.finally(() => {
          inFlight.delete(task);
          if (!socket.destroyed && pending < PAUSE_PENDING_PACKETS) socket.resume();
        });
        inFlight.add(task);
      } catch {
        closeReason = pending > MAX_PENDING_PACKETS ? "pending_limit" : "invalid_frame";
        report("frame_rejected", { reason: closeReason }, "warn");
        metrics.rejected++;
        socket.destroy();
      }
    });
    socket.on("timeout", () => {
      closeReason = "idle_timeout";
      report("connection_timeout", { reason: closeReason }, "warn");
      socket.destroy();
    });
    socket.on("error", (error) => {
      closeReason = "socket_error";
      report("connection_error", { reason: errorReason(error) }, "error");
      socket.destroy();
    });
    socket.on("close", () => {
      unsubscribe?.();
      unsubscribe = undefined;
      sockets.delete(socket);
      report("connection_closed", {
        reason: closeReason,
        connections: sockets.size,
        durationMs: Math.round(performance.now() - connected),
      });
      if (uid) {
        const closingUid = uid;
        const cleanup = chain
          .catch(() => {})
          .then(async () => {
            try {
              await dependencies.profileSessions?.close(closingUid, connectionId, Date.now());
            } finally {
              await cache.release(closingUid, token);
            }
          })
          .catch(() => report("session_cleanup_failed", { reason: "cache_release" }, "error"))
          .finally(() => {
            if (sessions.get(closingUid)?.socket === socket) sessions.delete(closingUid);
            inFlight.delete(cleanup);
          });
        inFlight.add(cleanup);
      }
    });
  };
}
