import { provisionPath } from "@opencok/contracts/provisioning";
import { createServer, type Socket } from "node:net";
import { Effect } from "effect";
import { logEvent } from "@opencok/core/logging";
import { serveHttp } from "@opencok/core/http";
import { acquireResource, fromPromise, ResourceError } from "@opencok/core/resource";
import { HEALTH_CHECK_INTERVAL_MS } from "@opencok/constants/connection";
import { MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import type { ConnectionConfig, ServerDependencies } from "./dependencies.ts";
import { createSessionHandler } from "./session.ts";

export function listenServer(config: ConnectionConfig, dependencies: ServerDependencies)
{
    return Effect.gen(function*()
    {
        const { db, cache, coordination } = dependencies;
        const sockets = new Set<Socket>();
        const inFlight = new Set<Promise<void>>();
        let healthy = false;
        let checked = false;
        let stopping = false;
        const metrics = { userId: 0, rejected: 0, commands: 0 };
        const check = fromPromise("realm.health", async () => {
            const results = await Promise.allSettled([db.health(), cache.command("PING")]);
            const next = results.every((result) => result.status === "fulfilled")
                && coordination.ready;

            if (!checked || next !== healthy)
            {
                logEvent(
                    "readiness_changed",
                    {
                        component: "realm",
                        kingdom: config.kingdomId,
                        ready: next,
                        database: results[0]!.status === "fulfilled",
                        cache: results[1]!.status === "fulfilled",
                        coordination: coordination.ready,
                    },
                    next ? "info" : "warn",
                );
            }

            checked = true;
            healthy = next;
        }).pipe(Effect.uninterruptible);
        const ready = () => healthy && coordination.ready && !stopping;
        yield* check;

        if (!ready())
        {
            return yield* Effect.fail(new ResourceError({ operation: "realm.readiness" }));
        }

        const listener = yield* acquireResource(
            "realm.tcp",
            async () =>
                createServer(
                    createSessionHandler(config, dependencies, {
                        sockets,
                        inFlight,
                        metrics,
                        ready,
                    }),
                ),
            async (listener) => {
                stopping = true;
                logEvent("connections_draining", {
                    kingdom: config.kingdomId,
                    connections: sockets.size,
                });
                const closed = new Promise<void>((resolve) => listener.close(() => resolve()));

                for (const socket of sockets)
                {
                    socket.destroy();
                }

                await closed;

                while (inFlight.size)
                {
                    await Promise.allSettled(inFlight);
                }
            },
        );
        yield* fromPromise(
            "realm.tcp.listen",
            () =>
                new Promise<void>((resolve, reject) => {
                    const onError = (error: Error) => reject(error);
                    listener.once("error", onError);
                    listener.listen(config.port, config.host, () => {
                        listener.removeListener("error", onError);
                        resolve();
                    });
                }),
        ).pipe(Effect.uninterruptible);

        const health = yield* serveHttp(
            { host: config.host, port: config.healthPort },
            (request) => {
                const path = new URL(request.url).pathname;

                if (path === provisionPath)
                {
                    return ready() && dependencies.provisioning
                        ? dependencies.provisioning(request)
                        : new Response(null, { status: 503 });
                }

                if (path !== "/healthz" && path !== "/readyz")
                {
                    return new Response("Not found", { status: 404 });
                }

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
        );
        yield* check.pipe(
            Effect.catch(() =>
                Effect.sync(() => {
                    healthy = false;
                })
            ),
            Effect.andThen(Effect.sleep(HEALTH_CHECK_INTERVAL_MS)),
            Effect.forever,
            Effect.forkScoped,
        );
        yield* Effect.addFinalizer(() =>
            Effect.sync(() => {
                stopping = true;
            })
        );
        const address = listener.address();

        return {
            port: typeof address === "object" && address ? address.port : config.port,
            healthPort: health.port,
            ready,
        };
    });
}
