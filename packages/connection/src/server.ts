import { createServer, type Socket } from "node:net";
import { HEALTH_CHECK_INTERVAL_MS } from "@opencok/constants/connection";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { DependencyError } from "@opencok/errors/dependency";
import type { ConnectionConfig, ServerDependencies } from "./dependencies.ts";
import { createSessionHandler } from "./session.ts";

export async function listenServer(config: ConnectionConfig, dependencies: ServerDependencies) {
  const { db, cache, coordination } = dependencies;
  const sockets = new Set<Socket>();
  const inFlight = new Set<Promise<void>>();
  let healthy = false;
  let stopping = false;
  let checkRunning = false;
  const metrics = { userId: 0, rejected: 0, commands: 0 };
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
  try {
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
  const listener = createServer(
    createSessionHandler(config, dependencies, { sockets, inFlight, metrics, ready }),
  );
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
            client: MOBILE_CLIENT_VERSION,
            kingdom: config.kingdomId,
            experimental: true,
            connections: sockets.size,
            commands: metrics.commands,
            rejected: metrics.rejected,
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
  }, HEALTH_CHECK_INTERVAL_MS);
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
