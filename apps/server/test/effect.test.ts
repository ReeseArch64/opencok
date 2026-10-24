import { expect, test } from "bun:test";
import { createConnection, createServer } from "node:net";
import { Effect, Layer, ManagedRuntime } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { RealmConfig, RealmConfigLive, config } from "../src/config.ts";
import { RealmDependencies, RealmServer, RealmServerLive } from "../src/server.ts";
import type { ServerDependencies } from "@opencok/connection/dependencies";

const source = Layer.succeed(EnvironmentSource, {
  DATABASE_URL: "postgresql://synthetic:secret@localhost/postgres",
  GAME_LOGIN_SECRET: "synthetic",
  GAME_RESOURCES: "fixtures",
  GAME_PORT: "0",
  GAME_HEALTH_PORT: "0",
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

const configured = RealmConfigLive.pipe(Layer.provide(source));

test("realm configuration derives database and ownership from the shared snapshot", async () => {
  const settings = await Effect.runPromise(config.pipe(Effect.provide(source)));
  expect(settings.kingdomId).toBe(2);
  expect(settings.kingdomDatabase).toBe("opencok_kingdom_2");
  expect(settings.zkPath).toBe("/opencok-experiment/COK2");
  expect(settings.resources.startsWith("/")).toBe(true);
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
