import { nicknameAccountUid } from "@opencok/account/repositories/nickname-identity";
import { realmChatDeliveries } from "@opencok/services/realm-chat-delivery";
import { initializeLogging, initializeTelemetry, logEvent } from "@opencok/core/logging";
import { loadChatEnvironment } from "@opencok/env/chat";
import { loadEnvironment } from "@opencok/env/load";
import { telemetrySchema } from "@opencok/env/telemetry";
import { validateEnvironment } from "@opencok/env/validation";
import { createChatRepository } from "./composition/chat-persistence";
import { ChatApplication } from "./chat-application.ts";

import { createChatArchiveStore } from "@opencok/mongoose/chat-archive";

initializeLogging("chat");

const config = loadChatEnvironment();

const activeTelemetry = initializeTelemetry(
    "chat",
    validateEnvironment(telemetrySchema, loadEnvironment(process.env)),
);

let archive: ReturnType<typeof createChatArchiveStore> | undefined;
let repository: ReturnType<typeof createChatRepository> | undefined;
let app: ChatApplication | undefined;

async function closeResources()
{
    try
    {
        await app?.close();
    }
    finally
    {
        try
        {
            await repository?.close();
        }
        finally
        {
            await archive?.close();
        }
    }
}

try
{
    logEvent("starting", { service: "chat" });
    archive = config.MONGO_URI ? createChatArchiveStore(config.MONGO_URI) : undefined;
    repository = createChatRepository({
        nicknameAccountUid,
        renderRealmEvents: (realm, owners, events) =>
            realmChatDeliveries(repository!, realm, owners, events),
        archive,
        databaseUrl: config.DATABASE_URL!,
        topology: {
            globalDatabase: config.GLOBAL_DATABASE_NAME,
            kingdoms: config.CHAT_KINGDOM_DATABASES,
        },
    });

    app = new ChatApplication({
        repository,
        instanceId: "chat-local",
        signingSecret: config.CHAT_SECRET,
        websocketUrl: "ws://192.168.1.104:8083/chat/ws",
        log: (event) =>
            logEvent(
                "chat_operation",
                { ...event },
                ["storage_unavailable", "socket_error", "unavailable", "auth_unavailable"].includes(
                        event.category,
                    )
                    ? "error"
                    : "warn",
            ),
    });
    await app.runMaintenance();
    await new Promise<void>((resolve, reject) => {
        app!.server.once("error", reject);
        app!.server.listen(8083, "0.0.0.0", resolve);
    });
    logEvent("listening", { port: 8083, outcome: "success" });
}
catch
{
    logEvent("service_failed", { service: "chat", outcome: "failure" }, "error");
    try
    {
        await closeResources();
    }
    finally
    {
        await activeTelemetry?.close();
    }

    throw new Error("Chat startup failed");
}

let stopping = false;

async function stop()
{
    if (stopping)
    {
        return;
    }

    stopping = true;

    try
    {
        await closeResources();
        logEvent("stopped", { service: "chat", outcome: "success" });
    }
    catch
    {
        logEvent("shutdown_failed", { service: "chat", outcome: "failure" }, "error");
        process.exitCode = 1;
    }
    finally
    {
        await activeTelemetry?.close();
    }
}

for (const signal of ["SIGTERM", "SIGINT"] as const)
{
    process.once(signal, () => {
        void stop().catch(() => {
            process.exitCode = 1;
        });
    });
}
