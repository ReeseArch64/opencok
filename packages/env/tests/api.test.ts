import { expect, test } from "bun:test";
import { parseApiEnvironment } from "../src/api.schema";

test("API settings are independent of legacy database and upload configuration", () => {
  const env = parseApiEnvironment({
    API_DB_HOST: "legacy",
    API_UPLOAD_KEY_FILE: "unused",
    API_GAME_HOST: "127.0.0.1",
    API_GAME_PORT: "9933",
  });
  expect(env.API_PORT).toBe(8082);
  expect(env.GLOBAL_DATABASE_NAME).toBe("opencok_global");
  expect(env.API_GAME_PORT).toBe(9933);
  expect(env).not.toHaveProperty("API_DB_HOST");
  expect(env).not.toHaveProperty("API_UPLOAD_KEY_FILE");
});

test("invalid API endpoints and private values report only variable names", () => {
  for (const API_GAME_HOST of ["0.0.0.0", "::", "http://localhost", "synthetic secret"]) {
    expect(() => parseApiEnvironment({ API_GAME_HOST })).toThrow("API_GAME_HOST");
  }
  expect(() => parseApiEnvironment({ API_GAME_PORT: "0" })).toThrow("API_GAME_PORT");
  expect(() =>
    parseApiEnvironment({ API_REDIS_URL: "https://synthetic-secret@example.invalid" }),
  ).toThrow("API_REDIS_URL");
  try {
    parseApiEnvironment({ API_REDIS_URL: "synthetic-secret" });
  } catch (error) {
    expect(String(error)).not.toContain("synthetic-secret");
  }
});

test("public chat discovery uses an optional HTTP origin without private URL components", () => {
  expect(parseApiEnvironment({}).API_CHAT_URL).toBeUndefined();
  expect(parseApiEnvironment({ API_CHAT_URL: "" }).API_CHAT_URL).toBeUndefined();
  expect(parseApiEnvironment({ API_CHAT_URL: "https://chat.internal:8083/" }).API_CHAT_URL).toBe(
    "https://chat.internal:8083/",
  );
  for (const value of [
    "invalid",
    "ws://chat.internal",
    "http://u:private-secret@chat.internal",
    "https://chat.internal/external/session",
    "https://chat.internal/?private=secret",
    "https://chat.internal/#secret",
    "https://cok.chat",
    "https://other.cok.chat",
  ])
    expect(() => parseApiEnvironment({ API_CHAT_URL: value })).toThrow("API_CHAT_URL");
});

test("API media is disabled by default and requires an explicit boolean flag", () => {
  expect(parseApiEnvironment({}).API_FILES_ENABLED).toBe(false);
  expect(parseApiEnvironment({ API_FILES_ENABLED: "true" }).API_FILES_ENABLED).toBe(true);
  expect(() => parseApiEnvironment({ API_FILES_ENABLED: "yes" })).toThrow("API_FILES_ENABLED");
});

test("creation requires complete trusted realm configuration without exposing secrets", () => {
  expect(parseApiEnvironment({}).API_PROVISIONING_REALMS).toBeUndefined();
  const configured = {
    FIREBASE_PROJECT_ID: "synthetic-project",
    PROVISIONING_SIGNING_SECRET: "synthetic-private-key-with-enough-length",
    API_PROVISIONING_REALMS: JSON.stringify([
      { id: 1, url: "http://realm:18090/_internal/characters" },
    ]),
  };
  expect(parseApiEnvironment(configured).API_PROVISIONING_REALMS).toHaveLength(1);
  for (const key of Object.keys(configured)) {
    const partial = { ...configured, [key]: "" };
    expect(() => parseApiEnvironment(partial)).toThrow();
  }
  for (const url of [
    "http://realm/wrong",
    "http://u:secret@realm/_internal/characters",
    "http://realm/_internal/characters?q=1",
    "file:///tmp/characters",
  ])
    expect(() =>
      parseApiEnvironment({
        ...configured,
        API_PROVISIONING_REALMS: JSON.stringify([{ id: 1, url }]),
      }),
    ).toThrow();
  expect(() =>
    parseApiEnvironment({ ...configured, API_PROVISIONING_REALMS: "invalid" }),
  ).toThrow();
  expect(() =>
    parseApiEnvironment({
      ...configured,
      API_PROVISIONING_REALMS: JSON.stringify([
        { id: 1, url: "http://realm/_internal/characters" },
        { id: 1, url: "http://other/_internal/characters" },
      ]),
    }),
  ).toThrow();
});
