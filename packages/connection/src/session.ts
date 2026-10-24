import {
  MAX_CONNECTIONS,
  SOCKET_TIMEOUT_MS,
  MAX_PENDING_PACKETS,
  PAUSE_PENDING_PACKETS,
  MAX_REPORTED_COMMANDS,
} from "@opencok/constants/connection";
import type { Socket } from "node:net";
import { createHash, randomBytes } from "node:crypto";
import { text } from "@opencok/contracts/rows";
import { authenticate, LoginError } from "@opencok/identity/mobile";
import { GameError } from "@opencok/errors/game";
import { FrameReader, frame, MAX_FRAME } from "@opencok/messages/frame";
import {
  envelope,
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
  const reportedCommands = new Set<string>();
  return (socket: Socket) => {
    if (sockets.size >= MAX_CONNECTIONS || !ready()) {
      socket.destroy();
      return;
    }
    sockets.add(socket);
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
        socket.destroy();
        return;
      }
      socket.write(bytes);
    };
    const handle = async (packet: Fields) => {
      if (!ready()) {
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
        let claimed: string | undefined;
        let stage = "authentication";
        try {
          const profile = await authenticate(body, db, config);
          claimed = text(profile, "uid");
          stage = "session";
          const previous = sessions.get(claimed);
          if (previous) {
            previous.socket.destroy();
            await cache.release(claimed, previous.token);
          }
          if (!(await cache.claim(claimed, token))) throw new LoginError();
          sessions.set(claimed, { socket, token });
          stage = "initialization";
          const initial = await game.initial(claimed);
          if (socket.destroyed || !ready()) {
            if (sessions.get(claimed)?.socket === socket) sessions.delete(claimed);
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
              p: sfs.object({ use: sfs.int(0) }),
            }),
          );
          const details = fields(body.p);
          if (details._cok_) initial._cok_ = details._cok_;
          send(extension("init", initial));
          if (!socket.destroyed)
            unsubscribe = dependencies.notifications?.subscribe(uid, async (command, body) => {
              if (
                socket.destroyed ||
                !ready() ||
                sessions.get(claimed!)?.socket !== socket ||
                !(await cache.refresh(claimed!, token))
              )
                return false;
              if (socket.destroyed || !ready() || sessions.get(claimed!)?.socket !== socket)
                return false;
              send(extension(command, body));
              return !socket.destroyed;
            });
          console.log(JSON.stringify({ event: "login_accepted", initialization: "partial" }));
        } catch (error) {
          console.log(
            JSON.stringify({
              event: "login_rejected",
              stage,
              reason:
                error instanceof LoginError
                  ? error.reason
                  : error instanceof GameError
                    ? (error.reason ?? "game_state")
                    : error instanceof ProtocolError
                      ? "protocol_shape"
                      : "dependency_or_encoding",
            }),
          );
          if (claimed) {
            if (sessions.get(claimed)?.socket === socket) sessions.delete(claimed);
            await cache.release(claimed, token).catch(() => {});
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
        socket.destroy();
        return;
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
      try {
        if (command === "cmd.finishinit") {
          if (!initialized)
            console.log(
              JSON.stringify({ event: "client_init_acknowledged", initialization: "partial" }),
            );
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
          const result = await game.execute(uid, command, params);
          for (const push of result.pushes) send(extension(push.command, push.body));
          send(extension(command, result.body));
        }
      } catch (error) {
        metrics.rejected++;

        const commandHash = createHash("sha256").update(command).digest("hex").slice(0, 16);
        if (reportedCommands.size < MAX_REPORTED_COMMANDS && !reportedCommands.has(commandHash)) {
          reportedCommands.add(commandHash);
          console.log(
            JSON.stringify({
              event: "command_rejected",
              commandHash,
              reason: error instanceof GameError ? error.code : "dependency_or_encoding",
            }),
          );
        }
        const result: Fields = {
          errorCode: sfs.string(error instanceof GameError ? error.code : "E100179"),
        };
        if (params._cok_) result._cok_ = params._cok_;
        if (params.cmdBaseTime) result.cmdBaseTime = params.cmdBaseTime;
        send(extension(command, result));
      }
    };
    socket.on("data", (data) => {
      try {
        for (const packet of reader.feed(Buffer.isBuffer(data) ? data : Buffer.from(data))) {
          if (++pending > MAX_PENDING_PACKETS) throw new ProtocolError();
          chain = chain
            .then(async () => {
              try {
                if (!socket.destroyed) await handle(packet);
              } finally {
                pending--;
              }
            })
            .catch(() => {
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
        metrics.rejected++;
        socket.destroy();
      }
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => socket.destroy());
    socket.on("close", () => {
      unsubscribe?.();
      unsubscribe = undefined;
      sockets.delete(socket);
      if (uid) {
        const closingUid = uid;
        const cleanup = cache
          .release(uid, token)
          .catch(() => {})
          .finally(() => {
            if (sessions.get(closingUid)?.socket === socket) sessions.delete(closingUid);
            inFlight.delete(cleanup);
          });
        inFlight.add(cleanup);
      }
    });
  };
}
