import { expect, test } from "bun:test";
import { createDatabases } from "@opencok/drizzle";
import { createChatRepository } from "@opencok/repositories/chat";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";

test("PostgreSQL preserves concurrent receipts, expiration, realm routing and restart state", async () => {
  const pg = new DisposablePostgres();
  let databases: ReturnType<typeof createDatabases> | undefined;
  let store: ReturnType<typeof createChatRepository> | undefined;
  let time = new Date("2026-01-01T00:00:00.000Z");
  try {
    const admin = await pg.start();
    try {
      for (const name of ["opencok_global", "opencok_kingdom_1", "opencok_kingdom_2"])
        {await admin.query(`CREATE DATABASE "${name}"`);}
    } finally {
      await admin.end();
    }
    databases = createDatabases(pg.options);
    await migrate(databases.global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    for (const kingdom of databases.kingdoms.values())
      {await migrate(kingdom.db, {
        migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
          .pathname,
      });}
    for (const id of [1, 2]) {
      await databases.global.db.insert(account_new).values({
        gameUid: `player-${id}`,
        server: String(id),
        uuid: "synthetic",
        gameUserLevel: 1,
        lastTime: 0n,
      });
      await databases
        .getKingdom(id)
        .db.insert(userprofile)
        .values({
          uid: `player-${id}`,
          name: "Synthetic",
          country: "US",
          level: 1,
          exp: 0,
          lang: "en",
          serverId: id,
        });
    }
    const databaseUrl = () =>
      `postgres://postgres:${pg.options.password}@127.0.0.1:${pg.options.port}/opencok_global`;
    store = createChatRepository({ databaseUrl: databaseUrl(), now: () => time });
    await store.health();
    expect((await store.getPlayerStateById("player-2"))?.serverId).toBe(2);
    expect((await store.getPlayerStateById("player-1"))?.originalServerId).toBe(1);
    expect(await store.getPlayerStateById("absent")).toBeNull();
    const hash = Buffer.alloc(32, 7);
    await store.sessions.create({
      tokenHash: hash,
      uid: "player-2",
      createdAt: time,
      expiresAt: new Date(time.getTime() + 86400000),
    });
    const input = {
      roomId: "country_2",
      senderUid: "player-2",
      idempotencyKey: "1",
      body: "Olá 世界",
      now: time,
    };
    const results = await Promise.all([store.messages.create(input), store.messages.create(input)]);
    expect(results.filter((result) => result.inserted)).toHaveLength(1);
    expect(results[0]!.sequenceId).toBe(results[1]!.sequenceId);
    await expect(store.messages.create({ ...input, body: "changed" })).rejects.toThrow("conflict");
    for (const body of ["\0", "\ud800", "x".repeat(501), ""])
      {await expect(store.messages.create({ ...input, body })).rejects.toThrow();}
    expect(await store.messages.getAll("country_1")).toHaveLength(0);
    await store.close();
    store = undefined;
    await pg.restart();
    store = createChatRepository({ databaseUrl: databaseUrl(), now: () => time });
    expect(await store.sessions.getById(hash)).toEqual({ uid: "player-2" });
    expect((await store.messages.getAll("country_2"))[0]?.body).toBe("Olá 世界");
    time = new Date(time.getTime() + 86400000);
    expect(await store.sessions.getById(hash)).toBeNull();
    expect(await store.messages.getAll("country_2")).toHaveLength(0);
    await expect(store.messages.create(input)).rejects.toThrow();
    expect(await store.deleteExpired()).toEqual({ messages: 1, sessions: 1 });
  } finally {
    await store?.close();
    await databases?.close();
    await pg.stop();
  }
}, 120000);
