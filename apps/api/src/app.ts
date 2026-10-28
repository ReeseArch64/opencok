import { observeAdapter } from "@opencok/core/operation";
import { Cache } from "@opencok/storage/session";
import { firebaseIdentity } from "@opencok/identity/firebase";
import { ProvisioningService } from "@opencok/account/services/provisioning";
import { ProvisioningController } from "@opencok/account/controllers/provisioning";
import { provisioningHandler, realmProvisioner } from "@opencok/connection/provisioning";
import { BODY_LIMIT } from "@opencok/contracts/files";
import { createFiles } from "./files.ts";
import { createChatDiscovery } from "@opencok/connection/chat-discovery";
import { Effect, Layer } from "effect";
import { logEvent } from "@opencok/core/logging";
import { ApiConfig } from "./config.ts";
import { acquireResource, fromPromise } from "@opencok/core/resource";
import { serveHttp } from "@opencok/core/http";
import { ApiRequestHandler } from "@opencok/api/api-request-handler";
import { ApiRouter } from "@opencok/api/api-router";
import { ServerDirectory } from "@opencok/storage/server-directory";
import { AccountStore } from "@opencok/account/repositories/account";
import { DiscoveryRedis } from "@opencok/storage/discovery-redis";

import { ApiDependencies } from "./api-dependencies.ts";

export { ApiDependencies } from "./api-dependencies.ts";

export const ApiDependenciesLive = Layer.effect(
    ApiDependencies,
    Effect.gen(function*()
    {
        const config = yield* ApiConfig;
        const accounts = yield* acquireResource(
            "api.accounts",
            async () => observeAdapter(new AccountStore(config), "api.AccountStore"),
            (store) => store.close(),
        );
        const directory = observeAdapter(new ServerDirectory(config), "api.ServerDirectory");
        const redis = observeAdapter(new DiscoveryRedis(config), "api.DiscoveryRedis");
        yield* fromPromise("api.directory", () => directory.read()).pipe(Effect.uninterruptible);
        yield* fromPromise("api.accounts.start", () => accounts.start()).pipe(
            Effect.uninterruptible,
        );
        yield* fromPromise("api.redis", () => redis.health()).pipe(Effect.uninterruptible);
        const identity = config.provisioning
            ? yield* acquireResource(
                "api.identity",
                async () =>
                    observeAdapter(
                        await firebaseIdentity(config.provisioning!.projectId),
                        "api.identity",
                    ),
                (value) => value.close(),
            )
            : undefined;

        return {
            provisioning: identity && config.provisioning
                ? provisioningHandler(
                    observeAdapter(
                        new ProvisioningController(
                            observeAdapter(
                                new ProvisioningService(
                                    identity,
                                    accounts.provisioning(),
                                    new Map(
                                        config.provisioning.realms.map((realm) => [
                                            realm.id,
                                            realmProvisioner(
                                                realm.url,
                                                config.provisioning!.secret,
                                                config.timeoutMs,
                                            ),
                                        ]),
                                    ),
                                ),
                                "api.ProvisioningService",
                            ),
                        ),
                        "api.ProvisioningController",
                    ),
                )
                : undefined,
            files: config.filesEnabled
                ? yield* observeAdapter(
                    createFiles((name, ...args) =>
                        observeAdapter(new Cache(config), "api.Cache").command(name, ...args)
                    ),
                    "api.createFiles",
                )
                : undefined,
            accounts,
            directory,
            redis,
            chatDiscovery: config.chatUrl
                ? observeAdapter(
                    createChatDiscovery({
                        origin: config.chatUrl,
                        timeoutMs: config.timeoutMs,
                    }),
                    "api.createChatDiscovery",
                )
                : undefined,
        };
    }),
);

export const createApp = Effect.gen(function*()
{
    const { accounts, directory, redis, chatDiscovery, files, provisioning } =
        yield* ApiDependencies;

    return new ApiRequestHandler(
        new ApiRouter({ accounts, directory, redis, chatDiscovery, files, provisioning }),
    );
});

export const serveApi = Effect.gen(function*()
{
    const config = yield* ApiConfig;
    const app = yield* createApp;
    const server = yield* serveHttp(
        {
            ...config,
            maxRequestBodySize: config.filesEnabled ? BODY_LIMIT : 65536,
            idleTimeout: 15,
        },
        app.fetch,
    );
    logEvent("listening", { host: config.host, port: server.port, outcome: "success" });

    return server;
});
