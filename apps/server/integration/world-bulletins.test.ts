import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";
import { Cache } from "@opencok/storage/session";
import { createWorldBulletinStore } from "@opencok/repositories/world-bulletins";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, decode, encode } from "@opencok/messages/sfs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
async function harness() {
  const h = await cityHarness(),
    redis = new DisposableRedis();
  try {
    const cache = new Cache({ redisUrl: await redis.start(), timeoutMs: 1000, kingdomId: 1 });
    await h.db.db.update(userprofile).set({ allianceId: "A" }).where(eq(userprofile.uid, "owner"));
    const records = ['{"att":{"name":"合成"},"win":0}', "  synthetic second\n", '{"third":true}'];
    await cache.command("RPUSH", "WORLD_BATTLE_BULLETIN_1A", ...records);
    await cache.command("RPUSH", "WORLD_BATTLE_BULLETIN_1B", '{"private":"other alliance"}');
    await cache.command("RPUSH", "WORLD_BATTLE_BULLETIN_2A", '{"private":"other realm"}');
    const game = new GameService({} as GameStore, h.rules, { kingdomId: 1 }, () => h.clock.now, {
      worldFightBulletins: {
        store: createWorldBulletinStore(h.db.db),
        page: (...args) => cache.worldFightBulletins(...args),
      },
      reconcileAlliance: async () => {
        throw new Error("Archive read attempted alliance reconciliation");
      },
    });
    return {
      ...h,
      redis,
      cache,
      records,
      game,
      query: (start = 0, end = -1) =>
        game.execute("owner", "al.fight.bulletin", { start: sfs.int(start), end: sfs.int(end) }),
    };
  } catch (error) {
    await redis.stop();
    await h.close();
    throw error;
  }
}
test("alliance battle archives retain native realm keys, Redis ranges and original UTF strings without creating history", async () => {
  const h = await harness();
  try {
    const before = await h.db.db.select().from(userprofile).orderBy(userprofile.uid);
    const reply = await h.query();
    expect(decode(encode(reply.body))).toEqual({ result: sfs.array(h.records.map(sfs.string)) });
    expect(reply.pushes).toEqual([]);
    expect((await h.query(-1, -1)).body).toEqual({
      result: sfs.array([sfs.string(h.records[2]!)]),
    });
    expect((await h.query(2, 0)).body).toEqual({ result: sfs.array([]) });
    expect((await h.query(0, 1)).body).toEqual({
      result: sfs.array(h.records.slice(0, 2).map(sfs.string)),
    });
    expect(await h.cache.command("LRANGE", "WORLD_BATTLE_BULLETIN_1A", "0", "-1")).toEqual(
      h.records,
    );
    expect(await h.db.db.select().from(userprofile).orderBy(userprofile.uid)).toEqual(before);
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
  } finally {
    await h.redis.stop();
    await h.close();
  }
}, 120000);
test("archive access uses the current authorized alliance and rejects blank, banned or foreign principals", async () => {
  const h = await harness();
  try {
    await h.db.db.update(userprofile).set({ allianceId: "" }).where(eq(userprofile.uid, "owner"));
    await expect(h.query()).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "A", banFlag: 1 })
      .where(eq(userprofile.uid, "owner"));
    await expect(h.query()).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ banFlag: 0, banTime: BigInt(h.clock.now) + 1n })
      .where(eq(userprofile.uid, "owner"));
    await expect(h.query()).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ banTime: 0n, serverId: 2 })
      .where(eq(userprofile.uid, "owner"));
    await expect(h.query()).rejects.toThrow();
    await h.db.db
      .update(userprofile)
      .set({ serverId: 1, allianceId: "empty" })
      .where(eq(userprofile.uid, "owner"));
    expect((await h.query()).body).toEqual({ result: sfs.array([]) });
  } finally {
    await h.redis.stop();
    await h.close();
  }
}, 120000);
test("archive adapter or Redis failure is unavailable and oversized native pages never become fake empty success", async () => {
  const h = await harness();
  try {
    const missing = new GameService({} as GameStore, h.rules, { kingdomId: 1 }, () => h.clock.now);
    await expect(
      missing.execute("owner", "al.fight.bulletin", { start: sfs.int(0), end: sfs.int(-1) }),
    ).rejects.toThrow();
    await h.cache.command(
      "RPUSH",
      "WORLD_BATTLE_BULLETIN_1A",
      ...Array.from({ length: 4096 }, () => "synthetic"),
    );
    await expect(h.query()).rejects.toThrow();
    expect((await h.query(0, 0)).body).toEqual({ result: sfs.array([sfs.string(h.records[0]!)]) });
    await h.cache.command("DEL", "WORLD_BATTLE_BULLETIN_1A");
    await h.cache.command("RPUSH", "WORLD_BATTLE_BULLETIN_1A", "x".repeat(32768));
    await expect(h.query()).rejects.toThrow();
    await h.redis.stop();
    await expect(h.query()).rejects.toThrow();
  } finally {
    await h.redis.stop();
    await h.close();
  }
}, 120000);
