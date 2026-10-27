import { expect, test } from "bun:test";
import { parseServerEnvironment } from "../src/server.schema";

const base = { GAME_LOGIN_SECRET: "synthetic-secret" };
test("server settings validate realm routing and require a login secret", () => {
  expect(parseServerEnvironment(base).KINGDOM_ID).toBe(1);
  expect(parseServerEnvironment({ ...base, KINGDOM_ID: "2" }).KINGDOM_ID).toBe(2);
  expect(() => parseServerEnvironment({})).toThrow("GAME_LOGIN_SECRET");
  for (const value of ["0", "-1", "1.5", "invalid"])
    expect(() => parseServerEnvironment({ ...base, KINGDOM_ID: value })).toThrow("KINGDOM_ID");
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

test("realm avatar integration needs only an explicit private API origin", () => {
  expect(parseServerEnvironment(base).GAME_FILES_URL).toBeUndefined();
  const configured = {
    ...base,
    GAME_FILES_URL: "http://files.internal:8084",
  };
  expect(parseServerEnvironment(configured).GAME_FILES_URL).toBe("http://files.internal:8084");
  expect(
    parseServerEnvironment({ ...base, GAME_FILES_URL: configured.GAME_FILES_URL }).GAME_FILES_URL,
  ).toBe(configured.GAME_FILES_URL);
  for (const url of [
    "invalid",
    "file:///private",
    "http://u:p@files.internal/",
    "http://files.internal/path",
    "http://files.internal/?private=x",
    "http://files.internal/#x",
  ])
    expect(() => parseServerEnvironment({ ...configured, GAME_FILES_URL: url })).toThrow(
      "GAME_FILES_URL",
    );
});

test("avatar completion requires its own private chat endpoint, files and signing secret", () => {
  const configured = {
    ...base,
    GAME_AVATAR_CHAT_URL: "http://chat.internal/_internal/avatar-profile",
    GAME_FILES_URL: "http://files.internal",
    CHAT_SIGNING_SECRET: "synthetic",
  };
  expect(parseServerEnvironment(base).GAME_AVATAR_CHAT_URL).toBeUndefined();
  expect(parseServerEnvironment(configured).GAME_AVATAR_CHAT_URL).toBe(
    configured.GAME_AVATAR_CHAT_URL,
  );
  for (const field of ["GAME_FILES_URL", "CHAT_SIGNING_SECRET"])
    expect(() => parseServerEnvironment({ ...configured, [field]: undefined })).toThrow(field);
  for (const url of [
    "http://chat.internal/external/session",
    configured.GAME_AVATAR_CHAT_URL + "?x=1",
    configured.GAME_AVATAR_CHAT_URL + "/",
    "http://u:p@chat.internal/_internal/avatar-profile",
    "https://cok.chat/_internal/avatar-profile",
  ])
    expect(() => parseServerEnvironment({ ...configured, GAME_AVATAR_CHAT_URL: url })).toThrow(
      "GAME_AVATAR_CHAT_URL",
    );
});

test("realm startup no longer accepts an external XML resource path", () => {
  expect(parseServerEnvironment({ ...base, GAME_RESOURCES: "obsolete" })).not.toHaveProperty(
    "GAME_RESOURCES",
  );
});

test("mailbox delivery requires an exact maintained endpoint and matching signing configuration", () => {
  const url = "http://chat.internal/_internal/mailbox";
  expect(parseServerEnvironment(base).GAME_MAIL_CHAT_URL).toBeUndefined();
  expect(
    parseServerEnvironment({ ...base, GAME_MAIL_CHAT_URL: url, CHAT_SIGNING_SECRET: "synthetic" })
      .GAME_MAIL_CHAT_URL,
  ).toBe(url);
  expect(() => parseServerEnvironment({ ...base, GAME_MAIL_CHAT_URL: url })).toThrow(
    "CHAT_SIGNING_SECRET",
  );
  for (const value of [
    url + "/",
    url + "?x=1",
    url + "#x",
    "http://cok.chat/_internal/mailbox",
    "http://user:pass@chat.internal/_internal/mailbox",
    "ftp://chat.internal/_internal/mailbox",
  ])
    expect(() =>
      parseServerEnvironment({
        ...base,
        GAME_MAIL_CHAT_URL: value,
        CHAT_SIGNING_SECRET: "synthetic",
      }),
    ).toThrow("GAME_MAIL_CHAT_URL");
});

test("nickname delivery requires a private endpoint and signing secret", () => {
  const url = "http://chat:8080/_internal/nickname";
  expect(
    parseServerEnvironment({
      ...base,
      GAME_NICKNAME_CHAT_URL: url,
      CHAT_SIGNING_SECRET: "synthetic",
    }).GAME_NICKNAME_CHAT_URL,
  ).toBe(url);
  expect(() => parseServerEnvironment({ ...base, GAME_NICKNAME_CHAT_URL: url })).toThrow(
    "CHAT_SIGNING_SECRET",
  );
  for (const value of [
    "http://cok.chat/_internal/nickname",
    "http://chat:8080/_internal/mailbox",
    "http://user:secret@chat/_internal/nickname",
    "http://chat/_internal/nickname?other=1",
  ])
    expect(() =>
      parseServerEnvironment({
        ...base,
        GAME_NICKNAME_CHAT_URL: value,
        CHAT_SIGNING_SECRET: "synthetic",
      }),
    ).toThrow("GAME_NICKNAME_CHAT_URL");
});
