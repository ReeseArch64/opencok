import { Effect, Layer } from "effect";
import { runService } from "@opencok/core/runtime";
import { EnvironmentLive } from "@opencok/env/effect";
import { RealmConfig, RealmConfigLive } from "./config.ts";
import { RealmLive, RealmServer } from "./server.ts";

const services = RealmLive.pipe(
  Layer.provideMerge(RealmConfigLive),
  Layer.provide(EnvironmentLive),
);

runService(
  "server",
  Effect.gen(function* () {
    const server = yield* RealmServer;
    const settings = yield* RealmConfig;
    console.info(
      JSON.stringify({
        event: "started",
        runtime: "bun",
        kingdom: settings.kingdomId,
        port: server.port,
        healthPort: server.healthPort,
        experimental: true,
      }),
    );
    yield* Effect.never;
  }).pipe(Effect.provide(services)),
);
