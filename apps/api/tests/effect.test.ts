import { expect, test } from "bun:test";
import { Effect, Layer, Exit } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { ApiConfig, ApiConfigLive, readConfig } from "../src/config.ts";
import { ApiDependencies, serveApi } from "../src/app.ts";

const source = Layer.succeed(EnvironmentSource, {
  DATABASE_URL: "postgresql://synthetic:secret@localhost/wrong?database=wrong&sslmode=require",
  GLOBAL_DATABASE_NAME: "synthetic_global",
  API_PORT: "0",
  KINGDOM_ID: "2",
});

test.each([
  undefined,
  "redis://synthetic:synthetic-secret@cache.internal:6380/4",
  "rediss://synthetic:synthetic-secret@cache.internal:6381/5",
])("API configuration uses shared REDIS_URL %s", async (REDIS_URL) => {
  const settings = await Effect.runPromise(
    readConfig.pipe(
      Effect.provideService(EnvironmentSource, {
        DATABASE_URL: "postgres://synthetic:secret@localhost/global",
        REDIS_URL,
      }),
    ),
  );

  expect(settings.redisUrl).toBe(REDIS_URL ?? "redis://127.0.0.1:6379/0");
});

test("API rejects invalid shared Redis URLs without disclosing credentials", async () => {
  const result = await Effect.runPromiseExit(
    readConfig.pipe(
      Effect.provideService(EnvironmentSource, {
        DATABASE_URL: "postgres://synthetic:secret@localhost/global",
        REDIS_URL: "https://synthetic:private-redis-secret@cache.invalid/4",
      }),
    ),
  );

  expect(Exit.isFailure(result)).toBe(true);
  expect(JSON.stringify(result)).toContain("REDIS_URL");
  expect(JSON.stringify(result)).not.toContain("private-redis-secret");
  expect(JSON.stringify(result)).not.toContain("cache.invalid");
});

test("Effect API config selects the global database from the injected environment", async () => {
  const config = await Effect.runPromise(readConfig.pipe(Effect.provide(source)));
  const url = new URL(config.databaseUrl);
  expect(url.pathname).toBe("/synthetic_global");
  expect(url.searchParams.has("database")).toBe(false);
  expect(url.searchParams.get("sslmode")).toBe("require");
  expect(config.kingdomId).toBe(2);
});

test("API Effect scope serves discovery and closes HTTP before dependencies", async () => {
  let port = 0;
  let closed = false;
  const dependencies = Layer.effect(
    ApiDependencies,
    Effect.acquireRelease(
      Effect.succeed({
        accounts: { getAll: async () => [], health: async () => {} },
        directory: { read: async () => new Map() },
        redis: { health: async () => {} },
      }),
      () =>
        Effect.promise(async () => {
          await expect(fetch(`http://127.0.0.1:${port}/healthz`)).rejects.toThrow();
          closed = true;
        }),
    ),
  );
  const layers = Layer.merge(dependencies, ApiConfigLive).pipe(Layer.provide(source));
  await Effect.runPromise(
    Effect.scoped(
      Effect.gen(function* () {
        const server = yield* serveApi;
        port = server.port;
        const response = yield* Effect.promise(() =>
          fetch(`http://127.0.0.1:${port}/gameservice/getline.php`, {
            method: "POST",
            body: "loginFlag=1",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }),
        );
        expect(response.status).toBe(200);
        expect(yield* Effect.promise(() => response.json())).toEqual({
          serverList: [],
          country: 1,
        });
        const config = yield* ApiConfig;
        expect(config.port).toBe(0);
      }),
    ).pipe(Effect.provide(layers)),
  );
  expect(closed).toBe(true);
});
