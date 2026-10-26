import { createChatRepository } from "@opencok/repositories/chat";
import { realmChatDeliveries } from "@opencok/services/realm-chat-delivery";
import { isRecord } from "@opencok/contracts/chat";
import { createChatApp } from "../../src/app";
const repository: ReturnType<typeof createChatRepository> = createChatRepository({
  databaseUrl: process.env.SOCIAL_TEST_DATABASE_URL!,
  renderRealmEvents: (realm, owners, events) =>
    realmChatDeliveries(repository, realm, owners, events),
});
const app = createChatApp({
  repository,
  signingSecret: "synthetic-social-secret",
  websocketUrl: "ws://127.0.0.1/chat/ws",
  instanceId: process.env.SOCIAL_TEST_INSTANCE!,
});
if (!(await app.runMaintenance())) throw new Error("Synthetic Chat worker unavailable");
await new Promise<void>((resolve) => app.server.listen(0, "127.0.0.1", resolve));
const address = app.server.address();
if (!address || typeof address === "string") throw new Error("Synthetic Chat address unavailable");
process.send?.({ type: "ready", port: address.port });
process.on("message", (message) => {
  if (isRecord(message) && message.type === "poll" && typeof message.id === "string")
    void app.runDistribution().then(() => process.send?.({ type: "polled", id: message.id }));
});
process.once("SIGTERM", () => {
  void app
    .close()
    .then(() => repository.close())
    .then(() => process.exit(0));
});
