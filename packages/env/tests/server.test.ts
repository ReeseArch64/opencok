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
