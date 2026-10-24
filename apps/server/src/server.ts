import { Context, Effect, Layer, ManagedRuntime } from "effect";
import { RealmConfig, type Config } from "./config.ts";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { listenServer } from "@opencok/connection/server";
import type { ServerDependencies } from "@opencok/connection/dependencies";
import { Database } from "@opencok/repositories/game";
import { Cache } from "@opencok/storage/session";
import { Coordination } from "@opencok/storage/coordination";
import { loadRules } from "@opencok/resources/rules";
import { Game } from "@opencok/controllers/game";
import { World } from "@opencok/controllers/world";

export class RealmDependencies extends Context.Service<RealmDependencies, ServerDependencies>()(
  "@opencok/server/Dependencies",
) {}

export const RealmDependenciesLive = Layer.effect(
  RealmDependencies,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    const rules = yield* fromPromise("realm.resources", () =>
      loadRules(config.resources, config.kingdomId),
    );
    const db = yield* acquireResource(
      "realm.database",
      async () => new Database(config),
      (db) => db.close(),
    );
    const cache = new Cache(config);
    const coordination = yield* acquireResource(
      "realm.coordination",
      async () => new Coordination(config),
      async (coordination) => coordination.close(),
    );
    yield* fromPromise("realm.database.start", () => db.start()).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.cache", () => cache.command("PING")).pipe(Effect.uninterruptible);
    yield* fromPromise("realm.coordination.start", () => coordination.start()).pipe(
      Effect.uninterruptible,
    );
    return {
      db,
      cache,
      coordination,
      game: new Game(db, rules, config, Date.now, {
        worldPowerEffects: () => cache.worldEffects(),
        emperorVersion: () => cache.emperorVersion(),
        changeAccountCount: (deviceId) => cache.deviceChangeCount(deviceId),
        playerUpdateTimes: (kingdomId, uids) => cache.playerUpdateTimes(kingdomId, uids),
      }),
      world: new World(db, config.mapSize, config.kingdomId),
    };
  }),
);

export class RealmServer extends Context.Service<
  RealmServer,
  Effect.Success<ReturnType<typeof listenServer>>
>()("@opencok/server/Server") {}

export const RealmServerLive = Layer.effect(
  RealmServer,
  Effect.gen(function* () {
    const config = yield* RealmConfig;
    const dependencies = yield* RealmDependencies;
    return yield* listenServer(config, dependencies);
  }),
);

export const RealmLive = RealmServerLive.pipe(Layer.provide(RealmDependenciesLive));

export async function startServer(config: Config) {
  const runtime = ManagedRuntime.make(
    RealmLive.pipe(Layer.provide(Layer.succeed(RealmConfig, config))),
  );
  try {
    const server = await runtime.runPromise(RealmServer);
    return { ...server, close: () => runtime.dispose() };
  } catch (error) {
    await runtime.dispose();
    throw error;
  }
}
