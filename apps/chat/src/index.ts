import { realmChatDeliveries } from "@opencok/services/realm-chat-delivery";
import { initializeLogging, logEvent } from "@opencok/core/logging";
import { loadChatEnvironment } from "@opencok/env/chat";
import { createChatRepository } from "@opencok/repositories/chat";
import { ChatApplication } from "./chat-application.ts";

import { createChatArchiveStore } from "@opencok/mongoose/chat-archive";

initializeLogging("chat");

logEvent("starting", { service: "chat" });

const config = loadChatEnvironment();

const archive = config.MONGO_URI ? createChatArchiveStore(config.MONGO_URI) : undefined;

const repository: ReturnType<typeof createChatRepository> = createChatRepository({
  renderRealmEvents: (realm, owners, events) =>
    realmChatDeliveries(repository, realm, owners, events),
  archive,
  databaseUrl: config.DATABASE_URL!,
  topology: {
    globalDatabase: config.GLOBAL_DATABASE_NAME,
    kingdoms: config.CHAT_KINGDOM_DATABASES,
  },
});

let app: ChatApplication | undefined;

try {
  app = new ChatApplication({
    repository,
    instanceId: config.CHAT_INSTANCE_ID,
    signingSecret: config.CHAT_SECRET,
    websocketUrl: config.CHAT_WEBSOCKET_URL,
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
    app!.server.listen(config.CHAT_PORT, config.CHAT_HOST, resolve);
  });
  logEvent("listening", { port: config.CHAT_PORT, outcome: "success" });
} catch {
  logEvent("service_failed", { service: "chat", outcome: "failure" }, "error");
  await app?.close();
  await repository.close();
  await archive?.close();

  throw new Error("Chat startup failed");
}

let stopping = false;

async function stop() {
  if (stopping) return;

  stopping = true;

  try {
    await app?.close();
  } finally {
    await repository.close();
    await archive?.close();
    logEvent("stopped", { service: "chat", outcome: "success" });
  }
}

for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.once(signal, () => {
    void stop().catch(() => {
      logEvent("shutdown_failed", { service: "chat", outcome: "failure" }, "error");
      process.exitCode = 1;
    });
  });
