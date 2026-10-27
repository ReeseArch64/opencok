import { expect, test } from "bun:test";
import { createConnection, createServer } from "node:net";
import { Effect, Layer, ManagedRuntime, Exit } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { RealmConfig, config } from "../src/config.ts";
import { RealmDependencies, RealmServer, RealmServerLive, startServer } from "../src/server.ts";
import { Rules } from "@opencok/rules/game";
import type { ServerDependencies } from "@opencok/connection/dependencies";

const source = Layer.succeed(EnvironmentSource, {
  DATABASE_URL: "postgresql://synthetic:secret@localhost/postgres",
  GAME_LOGIN_SECRET: "synthetic",
  KINGDOM_ID: "2",
});

const dependencies: ServerDependencies = {
  db: {
    start: async () => {},
    health: async () => {},
    close: async () => {},
    getProfileById: async () => undefined,
    getAccountsByPlayerId: async () => [],
    getPlayerSummariesByIds: async () => [],
    mailGroups: async () => {
      throw new Error("Unexpected mail groups");
    },
    mailBatch: async () => {
      throw new Error("Unexpected batch mail lookup");
    },
    mailCategory: async () => {
      throw new Error("Unexpected category lookup");
    },
    mailContents: async () => {
      throw new Error("Unexpected mail contents");
    },
    mailConversationSave: async () => {
      throw new Error("Unexpected conversation save");
    },
    mailDelete: async () => {
      throw new Error("Unexpected mailbox deletion");
    },
    mailRead: async () => {
      throw new Error("Unexpected mailbox read");
    },
    mailSave: async () => {
      throw new Error("Unexpected mailbox save");
    },
    mailStatus: async () => {
      throw new Error("Unexpected dependency call");
    },
    allianceRanking: async () => {
      throw new Error("Unexpected dependency call");
    },
    playerRanking: async () => {
      throw new Error("Unexpected ranking query");
    },
    publicProfile: async () => undefined,
    getPowerByPlayerId: async () => {
      throw new Error("unused");
    },
    getConfigurationByPlayerId: async () => ({
      profile: undefined,
      switches: [],
      pushSettings: [],
    }),
    getCityByPlayerId: async () => {
      throw new Error("unused");
    },
    getWorldByPointIds: async () => ({ world: undefined, points: [], hasMarches: false }),
  },
  cache: {
    command: async () => "PONG",
    claim: async () => true,
    refresh: async () => true,
    release: async () => {},
  },
  coordination: { ready: true, start: async () => {}, close: () => {} },
  game: {
    initialize: async () => ({ body: {}, pushes: [] }),
    execute: async () => ({ body: {}, pushes: [] }),
  },
  world: { get: async () => ({}) },
};

const configured = Layer.effect(
  RealmConfig,
  config.pipe(
    Effect.map((settings) => ({ ...settings, host: "127.0.0.1", port: 0, healthPort: 0 })),
  ),
).pipe(Layer.provide(source));

test.each([
  undefined,
  "redis://synthetic:synthetic-secret@cache.internal:6380/4",
  "rediss://synthetic:synthetic-secret@cache.internal:6381/5",
])("realm configuration uses shared REDIS_URL %s", async (REDIS_URL) => {
  const settings = await Effect.runPromise(
    config.pipe(
      Effect.provideService(EnvironmentSource, {
        DATABASE_URL: "postgres://synthetic:secret@localhost/global",
        GAME_LOGIN_SECRET: "synthetic",
        REDIS_URL,
      }),
    ),
  );

  expect(settings.redisUrl).toBe(REDIS_URL ?? "redis://127.0.0.1:6379/0");
});

test("realm rejects invalid shared Redis URLs without disclosing credentials", async () => {
  const result = await Effect.runPromiseExit(
    config.pipe(
      Effect.provideService(EnvironmentSource, {
        DATABASE_URL: "postgres://synthetic:secret@localhost/global",
        GAME_LOGIN_SECRET: "synthetic",
        REDIS_URL: "https://synthetic:private-redis-secret@cache.invalid/4",
      }),
    ),
  );

  expect(Exit.isFailure(result)).toBe(true);
  expect(JSON.stringify(result)).toContain("REDIS_URL");
  expect(JSON.stringify(result)).not.toContain("private-redis-secret");
  expect(JSON.stringify(result)).not.toContain("cache.invalid");
});

test("realm configuration derives database and ownership from the shared snapshot", async () => {
  const settings = await Effect.runPromise(config.pipe(Effect.provide(source)));
  expect(settings.kingdomId).toBe(2);
  expect(settings.kingdomDatabase).toBe("opencok_kingdom_2");
  expect(settings.zkPath).toBe("/opencok-experiment/COK2");
  expect(settings.host).toBe("0.0.0.0");
  expect(settings.port).toBe(9933);
  expect(settings.healthPort).toBe(18090);
  expect(settings.chatInterval).toBe(1);
  expect(settings.feedMaxCount).toBe(3);
  expect(settings.crossSearchEnabled).toBe(true);
  expect(settings.playerKingdoms).toBeUndefined();
  expect(settings).not.toHaveProperty("resources");
});

test("realm runtime disposes live sockets and health before closing dependencies, exactly once", async () => {
  let port = 0;
  let healthPort = 0;
  let closes = 0;
  const dependencyLayer = Layer.effect(
    RealmDependencies,
    Effect.acquireRelease(Effect.succeed(dependencies), () =>
      Effect.promise(async () => {
        await expect(fetch(`http://127.0.0.1:${healthPort}/readyz`)).rejects.toThrow();
        await expect(
          new Promise<void>((resolve, reject) => {
            const socket = createConnection({ host: "127.0.0.1", port });
            socket.once("error", reject);
            socket.once("connect", () => {
              socket.destroy();
              resolve();
            });
          }),
        ).rejects.toThrow();
        closes++;
      }),
    ),
  );
  const runtime = ManagedRuntime.make(
    RealmServerLive.pipe(Layer.provide(dependencyLayer), Layer.provide(configured)),
  );
  try {
    const server = await runtime.runPromise(RealmServer);
    ({ port, healthPort } = server);
    const socket = createConnection({ host: "127.0.0.1", port });
    await new Promise<void>((resolve, reject) => {
      socket.once("connect", resolve);
      socket.once("error", reject);
    });
    const closed = new Promise<void>((resolve) => socket.once("close", () => resolve()));
    expect((await fetch(`http://127.0.0.1:${healthPort}/readyz`)).status).toBe(200);
    await runtime.dispose();
    await closed;
    expect(server.ready()).toBe(false);
    await runtime.dispose();
    expect(closes).toBe(1);
  } finally {
    await runtime.dispose();
  }
});

test("health port bind failure rolls back an already opened TCP listener", async () => {
  const occupied = createServer();
  await new Promise<void>((resolve) => occupied.listen(0, "127.0.0.1", resolve));
  const address = occupied.address();
  if (!address || typeof address === "string") throw new Error("Missing listener address");
  const settings = await Effect.runPromise(config.pipe(Effect.provide(source)));
  const probe = createServer();
  await new Promise<void>((resolve) => probe.listen(0, "127.0.0.1", resolve));
  const probeAddress = probe.address();
  if (!probeAddress || typeof probeAddress === "string") throw new Error("Missing probe address");
  const port = probeAddress.port;
  await new Promise<void>((resolve) => probe.close(() => resolve()));
  const runtime = ManagedRuntime.make(
    RealmServerLive.pipe(
      Layer.provide(Layer.succeed(RealmDependencies, dependencies)),
      Layer.provide(Layer.succeed(RealmConfig, { ...settings, port, healthPort: address.port })),
    ),
  );
  try {
    await expect(runtime.runPromise(RealmServer)).rejects.toThrow();
    await runtime.dispose();
    await new Promise<void>((resolve, reject) => {
      probe.once("error", reject);
      probe.listen(port, "127.0.0.1", resolve);
    });
  } finally {
    await runtime.dispose();
    await new Promise<void>((resolve) => probe.close(() => resolve()));
    await new Promise<void>((resolve) => occupied.close(() => resolve()));
  }
});

test("realm startup rejects injected rules belonging to another kingdom before acquiring dependencies", async () => {
  const settings = await Effect.runPromise(config.pipe(Effect.provide(source)));
  const foreignRules = new Rules(new Map(), new Map(), new Map());
  await expect(startServer(settings, foreignRules)).rejects.toThrow(
    "Rules do not belong to the configured realm",
  );
});
