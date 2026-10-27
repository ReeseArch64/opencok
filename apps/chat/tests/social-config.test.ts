import { expect, test } from "bun:test";
import { parseChatEnvironment } from "@opencok/env/chat";
const base = {
  DATABASE_URL: "postgres://synthetic:synthetic@127.0.0.1/global",
  CHAT_SECRET: "synthetic-secret",
  CHAT_WEBSOCKET_URL: "ws://127.0.0.1/chat/ws",
};
test("blank optional archive settings keep PostgreSQL fallback available", () => {
  const config = parseChatEnvironment({ ...base, MONGO_URI: "", CHAT_INSTANCE_ID: "" });
  expect(config.MONGO_URI).toBeUndefined();
  expect(config.CHAT_INSTANCE_ID).toBeUndefined();
});
test("archive configuration requires a database and validates stable consumer identities", () => {
  expect(
    parseChatEnvironment({
      ...base,
      MONGO_URI: "mongodb://synthetic:synthetic@127.0.0.1/opencok_chat",
      CHAT_INSTANCE_ID: "chat-2",
    }).CHAT_INSTANCE_ID,
  ).toBe("chat-2");
  expect(() => parseChatEnvironment({ ...base, MONGO_URI: "mongodb://127.0.0.1" })).toThrow(
    "MONGO_URI",
  );
  expect(() => parseChatEnvironment({ ...base, CHAT_INSTANCE_ID: "other/consumer" })).toThrow(
    "CHAT_INSTANCE_ID",
  );
});
