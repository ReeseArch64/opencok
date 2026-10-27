import { expect, test } from "bun:test";
import { parseServerEnvironment } from "../src/server.schema";

const base = { GAME_SECRET: "synthetic-secret" };
test("server settings validate realm routing and require a login secret", () => {
  expect(parseServerEnvironment(base).KINGDOM_ID).toBe(1);
  expect(parseServerEnvironment({ ...base, KINGDOM_ID: "2" }).KINGDOM_ID).toBe(2);
  expect(() => parseServerEnvironment({})).toThrow("GAME_SECRET");
  for (const value of ["0", "-1", "1.5", "invalid"])
    {expect(() => parseServerEnvironment({ ...base, KINGDOM_ID: value })).toThrow("KINGDOM_ID");}
  expect(() => parseServerEnvironment({ ...base, KINGDOM_DATABASE_NAME: "db;drop" })).toThrow(
    "KINGDOM_DATABASE_NAME",
  );
  expect(() => parseServerEnvironment({ ...base, REDIS_URL: "https://localhost" })).toThrow(
    "REDIS_URL",
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
    {expect(() => parseServerEnvironment({ ...base, GAME_MAIL_TRANSLATION: value })).toThrow(
      "GAME_MAIL_TRANSLATION",
    );}
});

test("realm Chat integration requires an optional HTTP origin and shared signing secret", () => {
  expect(parseServerEnvironment(base).CHAT_URL).toBeUndefined();
  expect(parseServerEnvironment({ ...base, CHAT_SECRET: "synthetic" }).CHAT_URL).toBeUndefined();
  expect(
    parseServerEnvironment({ ...base, CHAT_URL: "", CHAT_SECRET: "" }).CHAT_URL,
  ).toBeUndefined();
  for (const CHAT_URL of [
    "http://chat.internal:8083",
    "https://chat.internal:8083/",
    "http://[::1]:8083",
  ]) {
    expect(parseServerEnvironment({ ...base, CHAT_URL, CHAT_SECRET: "synthetic" }).CHAT_URL).toBe(
      CHAT_URL,
    );
    expect(() => parseServerEnvironment({ ...base, CHAT_URL })).toThrow("CHAT_SECRET");
  }
  for (const CHAT_URL of [
    "invalid",
    "ws://chat.internal",
    "http://u:p@chat.internal",
    "https://chat.internal/external/session",
    "https://chat.internal/_internal/nickname",
    "https://chat.internal/_internal/mailbox",
    "https://chat.internal/?private=x",
    "https://chat.internal/#x",
    "https://cok.chat",
    "https://x.cok.chat",
  ]) {
    expect(() => parseServerEnvironment({ ...base, CHAT_URL, CHAT_SECRET: "synthetic" })).toThrow(
      "CHAT_URL",
    );
  }
});

test("realm avatar integration needs only an explicit private API origin", () => {
  expect(parseServerEnvironment(base).API_URL).toBeUndefined();
  const configured = {
    ...base,
    API_URL: "http://files.internal:8084",
  };
  expect(parseServerEnvironment(configured).API_URL).toBe("http://files.internal:8084");
  expect(parseServerEnvironment({ ...base, API_URL: configured.API_URL }).API_URL).toBe(
    configured.API_URL,
  );
  for (const url of [
    "invalid",
    "file:///private",
    "http://u:p@files.internal/",
    "http://files.internal/path",
    "http://files.internal/?private=x",
    "http://files.internal/#x",
  ])
    {expect(() => parseServerEnvironment({ ...configured, API_URL: url })).toThrow("API_URL");}
});

test("avatar completion requires its own private chat endpoint, files and signing secret", () => {
  const configured = {
    ...base,
    GAME_AVATAR_CHAT_URL: "http://chat.internal/_internal/avatar-profile",
    API_URL: "http://files.internal",
    CHAT_SECRET: "synthetic",
  };
  expect(parseServerEnvironment(base).GAME_AVATAR_CHAT_URL).toBeUndefined();
  expect(parseServerEnvironment(configured).GAME_AVATAR_CHAT_URL).toBe(
    configured.GAME_AVATAR_CHAT_URL,
  );
  for (const field of ["API_URL", "CHAT_SECRET"])
    {expect(() => parseServerEnvironment({ ...configured, [field]: undefined })).toThrow(field);}
  for (const url of [
    "http://chat.internal/external/session",
    configured.GAME_AVATAR_CHAT_URL + "?x=1",
    configured.GAME_AVATAR_CHAT_URL + "/",
    "http://u:p@chat.internal/_internal/avatar-profile",
    "https://cok.chat/_internal/avatar-profile",
  ])
    {expect(() => parseServerEnvironment({ ...configured, GAME_AVATAR_CHAT_URL: url })).toThrow(
      "GAME_AVATAR_CHAT_URL",
    );}
});

test("realm startup no longer accepts an external XML resource path", () => {
  expect(parseServerEnvironment({ ...base, GAME_RESOURCES: "obsolete" })).not.toHaveProperty(
    "GAME_RESOURCES",
  );
});
