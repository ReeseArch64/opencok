import { expect, test } from "bun:test";
import { Effect, Layer, Exit } from "effect";
import { databaseUrl, EnvironmentSource, readEnvironment } from "../src/effect";
import { apiSchema } from "../src/api.schema";
import { serverSchema } from "../src/server.schema";

const source = Layer.succeed(EnvironmentSource, {
  DATABASE_URL: "postgresql://example:secret@localhost/global",
  KINGDOM_ID: "2",
  GAME_LOGIN_SECRET: "synthetic",
});

test("API and realm read the same injected snapshot with independent service defaults", async () => {
  const result = await Effect.runPromise(
    Effect.all([readEnvironment(apiSchema), readEnvironment(serverSchema), databaseUrl]).pipe(
      Effect.provide(source),
    ),
  );
  expect(result[0].KINGDOM_ID).toBe(2);
  expect(result[1].KINGDOM_ID).toBe(2);
  expect(result[0].GLOBAL_DATABASE_NAME).toBe(result[1].GLOBAL_DATABASE_NAME);
  expect(result[0].API_PORT).toBe(8082);
  for (const name of ["GAME_HOST", "GAME_PORT", "GAME_HEALTH_PORT"]) {
    expect(result[1]).not.toHaveProperty(name);
  }
  expect(result[2]).toBe("postgresql://example:secret@localhost/global");
});

test.each([
  "redis://synthetic:synthetic-secret@cache.internal:6380/4",
  "rediss://synthetic:synthetic-secret@cache.internal:6381/5",
])("API and realm schemas preserve the same shared Redis URL %s", async (REDIS_URL) => {
  const [api, realm] = await Effect.runPromise(
    Effect.all([readEnvironment(apiSchema), readEnvironment(serverSchema)]).pipe(
      Effect.provideService(EnvironmentSource, { GAME_LOGIN_SECRET: "synthetic", REDIS_URL }),
    ),
  );

  expect(api.REDIS_URL).toBe(REDIS_URL);
  expect(realm.REDIS_URL).toBe(REDIS_URL);
});

test("configuration fails inside the Effect without leaking supplied secrets", async () => {
  for (const values of [{ DATABASE_URL: "private-secret" }, {}]) {
    const result = await Effect.runPromiseExit(
      databaseUrl.pipe(Effect.provideService(EnvironmentSource, values)),
    );
    expect(Exit.isFailure(result)).toBe(true);
    expect(JSON.stringify(result)).toContain("DATABASE_URL");
    expect(JSON.stringify(result)).not.toContain("private-secret");
  }
});

test("API configuration does not require game credentials or resources", async () => {
  const result = await Effect.runPromise(
    readEnvironment(apiSchema).pipe(Effect.provideService(EnvironmentSource, {})),
  );
  expect(result.KINGDOM_ID).toBe(1);
});
