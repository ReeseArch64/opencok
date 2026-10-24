import { Context, Effect, Layer } from "effect";
import { logEvent } from "@opencok/core/logging";
import { ApiConfig } from "./config.ts";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { serveHttp } from "@opencok/core/http";
import { createHandler } from "@opencok/api/handler";
import { ServerDirectory } from "@opencok/storage/server-directory";
import { AccountStore } from "@opencok/repositories/account";
import { DiscoveryRedis } from "@opencok/storage/discovery-redis";

export class ApiDependencies extends Context.Service<
  ApiDependencies,
  {
    accounts: Parameters<typeof createHandler>[0];
    directory: Parameters<typeof createHandler>[1];
    redis: Parameters<typeof createHandler>[2];
  }
>()("@opencok/api/Dependencies") {}

export const ApiDependenciesLive = Layer.effect(
  ApiDependencies,
  Effect.gen(function* () {
    const config = yield* ApiConfig;
    const accounts = yield* acquireResource(
      "api.accounts",
      async () => new AccountStore(config),
      (store) => store.close(),
    );
    const directory = new ServerDirectory(config);
    const redis = new DiscoveryRedis(config);
    yield* fromPromise("api.directory", () => directory.read()).pipe(Effect.uninterruptible);
    yield* fromPromise("api.accounts.start", () => accounts.start()).pipe(Effect.uninterruptible);
    yield* fromPromise("api.redis", () => redis.health()).pipe(Effect.uninterruptible);
    return { accounts, directory, redis };
  }),
);

export const createApp = Effect.gen(function* () {
  const { accounts, directory, redis } = yield* ApiDependencies;
  return createHandler(accounts, directory, redis);
});

export const serveApi = Effect.gen(function* () {
  const config = yield* ApiConfig;
  const app = yield* createApp;
  const server = yield* serveHttp(config, app.fetch);
  logEvent("listening", { host: config.host, port: server.port, outcome: "success" });
  return server;
});
