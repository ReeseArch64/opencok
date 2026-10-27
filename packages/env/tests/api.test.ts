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
    parseApiEnvironment({ REDIS_URL: "https://synthetic-secret@example.invalid" }),
  ).toThrow("REDIS_URL");
  try {
    parseApiEnvironment({ REDIS_URL: "synthetic-secret" });
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

test("API media requires five S3 settings and supports an optional internal storage origin", () => {
  expect(parseApiEnvironment({}).S3_BUCKET).toBeUndefined();
  const media = {
    S3_PUBLIC_ENDPOINT: "http://s3.example:9000",
    S3_REGION: "us-east-1",
    S3_BUCKET: "images",
    S3_ACCESS_KEY_ID: "synthetic",
    S3_SECRET_ACCESS_KEY: "synthetic-secret",
  };
  expect(parseApiEnvironment(media).S3_BUCKET).toBe("images");
  expect(parseApiEnvironment(media).S3_ENDPOINT).toBeUndefined();
  expect(parseApiEnvironment({ ...media, S3_ENDPOINT: "http://minio:9000" }).S3_ENDPOINT).toBe(
    "http://minio:9000",
  );
  for (const field of Object.keys(media))
    expect(() => parseApiEnvironment({ ...media, [field]: undefined })).toThrow();
  expect(
    parseApiEnvironment(Object.fromEntries(Object.keys(media).map((key) => [key, ""]))).S3_BUCKET,
  ).toBeUndefined();
  for (const endpoint of [
    "file:///private",
    "http://u:p@s3.example",
    "http://s3.example/path",
    "http://s3.example/?key=x",
  ])
    expect(() => parseApiEnvironment({ ...media, S3_PUBLIC_ENDPOINT: endpoint })).toThrow(
      "S3_PUBLIC_ENDPOINT",
    );
  for (const endpoint of ["file:///private", "http://u:p@minio:9000", "http://minio/path"])
    expect(() => parseApiEnvironment({ ...media, S3_ENDPOINT: endpoint })).toThrow("S3_ENDPOINT");
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
