import { firebaseIdentity } from "@opencok/identity/firebase";
import { ProvisioningService } from "@opencok/services/provisioning";
import { ProvisioningController } from "@opencok/controllers/provisioning";
import { provisioningHandler, realmProvisioner } from "@opencok/connection/provisioning";
import { BODY_LIMIT } from "@opencok/contracts/files";
import { createFiles } from "./files.ts";
import { createChatDiscovery } from "@opencok/connection/chat-discovery";
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
    chatDiscovery?: Parameters<typeof createHandler>[3];
    files?: Parameters<typeof createHandler>[4];
    provisioning?: Parameters<typeof createHandler>[5];
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
    const identity = config.provisioning
      ? yield* acquireResource(
          "api.identity",
          async () => firebaseIdentity(config.provisioning!.projectId),
          (value) => value.close(),
        )
      : undefined;
    return {
      provisioning:
        identity && config.provisioning
          ? provisioningHandler(
              new ProvisioningController(
                new ProvisioningService(
                  identity,
                  accounts.provisioning(),
                  new Map(
                    config.provisioning.realms.map((realm) => [
                      realm.id,
                      realmProvisioner(realm.url, config.provisioning!.secret, config.timeoutMs),
                    ]),
                  ),
                ),
              ),
            )
          : undefined,
      files: config.filesEnabled ? yield* createFiles : undefined,
      accounts,
      directory,
      redis,
      chatDiscovery: config.chatUrl
        ? createChatDiscovery({
            origin: config.chatUrl,
            timeoutMs: config.timeoutMs,
          })
        : undefined,
    };
  }),
);

export const createApp = Effect.gen(function* () {
  const { accounts, directory, redis, chatDiscovery, files, provisioning } = yield* ApiDependencies;
  return createHandler(accounts, directory, redis, chatDiscovery, files, provisioning);
});

export const serveApi = Effect.gen(function* () {
  const config = yield* ApiConfig;
  const app = yield* createApp;
  const server = yield* serveHttp(
    { ...config, maxRequestBodySize: config.filesEnabled ? BODY_LIMIT : 65536, idleTimeout: 15 },
    app.fetch,
  );
  logEvent("listening", { host: config.host, port: server.port, outcome: "success" });
  return server;
});
