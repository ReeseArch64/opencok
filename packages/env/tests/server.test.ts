import { expect, test } from "bun:test";
import { parseServerEnvironment } from "../src/server.schema";

const base = { GAME_LOGIN_SECRET: "synthetic-secret", GAME_RESOURCES: "synthetic-resources" };
test("server settings validate realm routing and require private inputs", () => {
  expect(parseServerEnvironment(base).KINGDOM_ID).toBe(1);
  expect(parseServerEnvironment({ ...base, KINGDOM_ID: "2", GAME_PORT: "0" }).KINGDOM_ID).toBe(2);
  expect(() => parseServerEnvironment({})).toThrow("GAME_LOGIN_SECRET");
  for (const value of ["0", "-1", "1.5", "invalid"])
    expect(() => parseServerEnvironment({ ...base, KINGDOM_ID: value })).toThrow("KINGDOM_ID");
  expect(() => parseServerEnvironment({ ...base, KINGDOM_DATABASE_NAME: "db;drop" })).toThrow(
    "KINGDOM_DATABASE_NAME",
  );
  expect(() => parseServerEnvironment({ ...base, GAME_REDIS_URL: "https://localhost" })).toThrow(
    "GAME_REDIS_URL",
  );
  expect(() => parseServerEnvironment({ ...base, GAME_PORT: "65536" })).toThrow("GAME_PORT");
});

test("public player realm routes are explicit, bounded and validated", () => {
  expect(parseServerEnvironment(base).GAME_PLAYER_KINGDOMS).toBeUndefined();
  expect(
    parseServerEnvironment({ ...base, GAME_PLAYER_KINGDOMS: "1:kingdom_one,2:kingdom_two" })
      .GAME_PLAYER_KINGDOMS,
  ).toEqual([
    { id: 1, database: "kingdom_one" },
    { id: 2, database: "kingdom_two" },
  ]);
  for (const value of [
    "0:kingdom",
    "2:kingdom:extra",
    "2:db;drop",
    "2:kingdom,2:other",
    "1:same,2:same",
    "1:one,2:two,3:three",
  ])
    expect(() => parseServerEnvironment({ ...base, GAME_PLAYER_KINGDOMS: value })).toThrow(
      "GAME_PLAYER_KINGDOMS",
    );
});

test("mail translation defaults enabled and accepts explicit true or false only", () => {
  expect(parseServerEnvironment(base).GAME_MAIL_TRANSLATION).toBe(true);
  expect(
    parseServerEnvironment({ ...base, GAME_MAIL_TRANSLATION: "false" }).GAME_MAIL_TRANSLATION,
  ).toBe(false);
  expect(
    parseServerEnvironment({ ...base, GAME_MAIL_TRANSLATION: "true" }).GAME_MAIL_TRANSLATION,
  ).toBe(true);
  for (const value of ["0", "1", "yes", "FALSE", ""])
    expect(() => parseServerEnvironment({ ...base, GAME_MAIL_TRANSLATION: value })).toThrow(
      "GAME_MAIL_TRANSLATION",
    );
});

test("realm chat session issuance is opt-in and requires a valid internal endpoint and shared secret", () => {
  expect(parseServerEnvironment(base).GAME_CHAT_SESSION_URL).toBeUndefined();
  expect(
    parseServerEnvironment({ ...base, CHAT_SIGNING_SECRET: "synthetic" }).GAME_CHAT_SESSION_URL,
  ).toBeUndefined();
  expect(
    parseServerEnvironment({ ...base, GAME_CHAT_SESSION_URL: "", CHAT_SIGNING_SECRET: "" })
      .CHAT_SIGNING_SECRET,
  ).toBeUndefined();
  const url = "https://chat.internal/external/session";
  expect(
    parseServerEnvironment({
      ...base,
      GAME_CHAT_SESSION_URL: url,
      CHAT_SIGNING_SECRET: "synthetic",
    }).GAME_CHAT_SESSION_URL,
  ).toBe(url);
  expect(() => parseServerEnvironment({ ...base, GAME_CHAT_SESSION_URL: url })).toThrow(
    "CHAT_SIGNING_SECRET",
  );
  for (const value of [
    "invalid",
    "ws://chat.internal/external/session",
    "http://u:p@chat.internal/external/session",
    "https://chat.internal/other",
    "https://chat.internal/external/session?private=x",
    "https://chat.internal/external/session#x",
    "https://cok.chat/external/session",
    "https://x.cok.chat/external/session",
  ])
    expect(() =>
      parseServerEnvironment({
        ...base,
        GAME_CHAT_SESSION_URL: value,
        CHAT_SIGNING_SECRET: "synthetic",
      }),
    ).toThrow("GAME_CHAT_SESSION_URL");
});
