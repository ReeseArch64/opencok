import { createServer, type Socket } from "node:net";
import { createHash, randomBytes } from "node:crypto";
import type { Config } from "./config.ts";
import { Cache, Coordination, Database, DependencyError } from "./infra.ts";
import { text } from "./game/rows.ts";
import { authenticate, LoginError } from "./game/auth.ts";
import { Game } from "./game/game.ts";
import { World } from "./game/world.ts";
import { GameError, Rules } from "./game/rules.ts";
import { FrameReader, frame, MAX_FRAME } from "./protocol/frame.ts";
import {
  envelope,
  extension,
  fields,
  ProtocolError,
  sfs,
  str,
  Type,
  type Fields,
} from "./protocol/sfs.ts";

export async function startServer(config: Config) {
  const db = new Database(config);
  const cache = new Cache(config);
  const coordination = new Coordination(config);
  const sockets = new Set<Socket>();
  const sessions = new Map<string, { socket: Socket; token: string }>();
  const inFlight = new Set<Promise<void>>();
  let healthy = false;
  let stopping = false;
  let userId = 0;
  let checkRunning = false;
  let rejected = 0;
  let commands = 0;
  const reportedCommands = new Set<string>();
  const check = async () => {
    if (checkRunning || stopping) return;
    checkRunning = true;
    try {
      const results = await Promise.allSettled([db.health(), cache.command("PING")]);
      healthy = results.every((r) => r.status === "fulfilled") && coordination.ready;
    } finally {
      checkRunning = false;
    }
  };
  const ready = () => healthy && coordination.ready && !stopping;
  let rules: Rules;
  try {
    rules = await Rules.load(config.resources, config.kingdomId);
    await db.start();
    await cache.command("PING");
    await coordination.start();
    await check();
    if (!ready()) throw new DependencyError("startup");
  } catch (error) {
    coordination.close();
    await db.close();
    throw error;
  }
  const game = new Game(db, rules, config);
  const world = new World(db, config.mapSize, config.kingdomId);
  const listener = createServer((socket) => {
    if (sockets.size >= 128 || !ready()) {
      socket.destroy();
      return;
    }
    sockets.add(socket);
    socket.setTimeout(120000);
    socket.setNoDelay(true);
    const reader = new FrameReader();
    const token = randomBytes(24).toString("hex");
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
              id: sfs.int(++userId),
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
          rejected++;
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
      commands++;
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
        rejected++;

        const commandHash = createHash("sha256").update(command).digest("hex").slice(0, 16);
        if (reportedCommands.size < 128 && !reportedCommands.has(commandHash)) {
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
          if (++pending > 64) throw new ProtocolError();
          chain = chain
            .then(async () => {
              try {
                if (!socket.destroyed) await handle(packet);
              } finally {
                pending--;
              }
            })
            .catch(() => {
              rejected++;
              socket.destroy();
            });
        }
        if (pending >= 32) socket.pause();
        const task = chain.finally(() => {
          inFlight.delete(task);
          if (!socket.destroyed && pending < 32) socket.resume();
        });
        inFlight.add(task);
      } catch {
        rejected++;
        socket.destroy();
      }
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => socket.destroy());
    socket.on("close", () => {
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
  });
  let health: ReturnType<typeof Bun.serve> | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      listener.once("error", reject);
      listener.listen(config.port, config.host, resolve);
    });
    health = Bun.serve({
      hostname: config.host,
      port: config.healthPort,
      fetch(request) {
        const path = new URL(request.url).pathname;
        if (path !== "/healthz" && path !== "/readyz")
          return new Response("Not found", { status: 404 });
        return Response.json(
          {
            status: ready() ? "ready" : "unavailable",
            runtime: "bun",
            client: "12.06.0",
            kingdom: config.kingdomId,
            experimental: true,
            connections: sockets.size,
            commands,
            rejected,
          },
          { status: ready() ? 200 : 503 },
        );
      },
    });
  } catch (error) {
    listener.close();
    coordination.close();
    await db.close();
    throw error;
  }
  const interval = setInterval(() => {
    void check().catch(() => {
      healthy = false;
    });
  }, 2000);
  const address = listener.address();
  return {
    port: typeof address === "object" && address ? address.port : config.port,
    healthPort: health.port,
    ready,
    async close() {
      stopping = true;
      clearInterval(interval);
      health?.stop(true);
      const closed = new Promise<void>((resolve) => listener.close(() => resolve()));
      for (const socket of sockets) socket.destroy();
      await closed;

      while (inFlight.size) await Promise.allSettled(inFlight);
      coordination.close();
      await db.close();
    },
  };
}
