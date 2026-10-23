import { loadChatEnvironment } from "@opencok/env/chat";
import { createChatRepository } from "@opencok/repositories/chat";
import { createChatApp } from "./app";

const config = loadChatEnvironment();
const repository = createChatRepository({
  databaseUrl: config.DATABASE_URL!,
  topology: {
    globalDatabase: config.GLOBAL_DATABASE_NAME,
    kingdoms: config.CHAT_KINGDOM_DATABASES,
  },
});
let app: ReturnType<typeof createChatApp> | undefined;
try {
  app = createChatApp({
    repository,
    signingSecret: config.CHAT_SIGNING_SECRET,
    websocketUrl: config.CHAT_WEBSOCKET_URL,
    log: (event) => process.stdout.write(`${JSON.stringify(event)}\n`),
  });
  await app.runMaintenance();
  await new Promise<void>((resolve, reject) => {
    app!.server.once("error", reject);
    app!.server.listen(config.CHAT_PORT, config.CHAT_HOST, resolve);
  });
} catch {
  await app?.close();
  await repository.close();
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
  }
}
for (const signal of ["SIGTERM", "SIGINT"] as const)
  process.once(signal, () => {
    void stop().catch(() => {
      process.exitCode = 1;
    });
  });
