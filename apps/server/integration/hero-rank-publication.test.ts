import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { HeroRankPublicationService } from "@opencok/hero/services/hero-rank-publication";
import {
  createHeroRankSource,
  createHeroRankProjection,
} from "@opencok/hero/repositories/hero-rank-publication";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { heroRankingLookup } from "@opencok/hero/rules/hero-ranking";
import { Cache } from "@opencok/storage/session";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { hero_rank_score } from "@opencok/drizzle/schema/opencok_global/hero_rank_score";
import { hero_rank_owner } from "@opencok/drizzle/schema/opencok_global/hero_rank_owner";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";
async function fixture() {
  const h = await cityHarness(),
    redis = new DisposableRedis(),
    closers = [h.close, () => redis.stop()];
  try {
    h.clock.now = Date.now();
    const redisUrl = await redis.start(),
      cache = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 1 }),
      cache2 = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 2 });
    await h.db.pool.query('CREATE DATABASE "hero_rank_global"');
    await h.db.pool.query('CREATE DATABASE "hero_rank_second"');
    const global = createDatabase("global", { ...h.connection, database: "hero_rank_global" }),
      second = createDatabase("kingdom", { ...h.connection, database: "hero_rank_second" });
    closers.push(global.close, second.close);
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    await migrate(second.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const authority2 = await acquireRealmAuthority(second.db, 2, () => true),
      rules2 = await loadRules(undefined, 2),
      now = () => h.clock.now;
    for (const [db, id] of [
      [h.db, "left"],
      [second, "right"],
    ] as const)
      {await db.db.insert(hero_event).values({
        uuid: id,
        eventId: "9001000",
        activityId: "main",
        type: 1,
        rewardType: 1,
        startTime: BigInt(h.clock.now - 1000),
        endTime: BigInt(h.clock.now + 3600000),
      });}
    await h.db.db.insert(score_act).values([
      { uid: "owner", actId: "left", level: 0, score: 100, finishFlag: 0, rewardFlag: "" },
      { uid: "other", actId: "left", level: 0, score: 100, finishFlag: 0, rewardFlag: "" },
    ]);
    await second.db.insert(score_act).values({
      uid: "remote",
      actId: "right",
      level: 0,
      score: 120,
      finishFlag: 0,
      rewardFlag: "",
    });
    const source = createHeroRankSource(h.db.db, h.authority),
      projection = createHeroRankProjection(global.db, h.authority),
      projection2 = createHeroRankProjection(global.db, authority2),
      service = new HeroRankPublicationService(
        source,
        projection,
        (rows) => cache.publishHeroRanking(rows),
        h.rules,
        now,
      ),
      service2 = new HeroRankPublicationService(
        createHeroRankSource(second.db, authority2),
        projection2,
        (rows) => cache2.publishHeroRanking(rows),
        rules2,
        now,
      );
    const lookup = async (member = "owner", type = 1) => {
      const event = (await h.db.db.select().from(hero_event)).find((row) => row.type === type)!;
      const query = heroRankingLookup(
        event,
        type === 2 || type === 4 ? "" : member,
        type === 2 || type === 4 ? member : "",
        h.rules,
        1,
        "12.06.0",
      );
      if (typeof query === "number") {throw new Error("Synthetic hero ranking gate closed");}
      return query;
    };
    return {
      ...h,
      global,
      second,
      cache,
      cache2,
      source,
      projection,
      projection2,
      service,
      service2,
      lookup,
      close: async () => {
        for (const close of closers.toReversed()) {await close();}
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) {await close();}
    throw error;
  }
}
test("owned hero score pages publish a shared ordered rank and rebuild it after Redis loss", async () => {
  const h = await fixture();
  try {
    await Promise.all([h.service.refresh(), h.service2.refresh()]);
    expect(await h.cache.heroRankingPosition(await h.lookup("remote"))).toBe(1);
    expect(await h.cache.heroRankingPosition(await h.lookup("other"))).toBe(2);
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(3);
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(3);
    await h.db.db.update(score_act).set({ score: 150 }).where(eq(score_act.uid, "owner"));
    await h.service.refresh();
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(1);
    await h.db.db.update(score_act).set({ score: -2 }).where(eq(score_act.uid, "owner"));
    await h.service.refresh();
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(3);
    await h.cache.command("FLUSHDB");
    const restarted = new HeroRankPublicationService(
      h.source,
      h.projection,
      (rows) => h.cache.publishHeroRanking(rows),
      h.rules,
      () => h.clock.now,
    );
    await restarted.refresh();
    await h.service2.refresh();
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(3);
    expect(
      (await h.global.db.select().from(hero_rank_score)).find((row) => row.member === "owner")!
        .score,
    ).toBe(-2);
  } finally {
    await h.close();
  }
}, 120000);
test("new realm authority fences global hero projection and delayed Redis publication cannot regress its score", async () => {
  const h = await fixture();
  try {
    await h.service.refresh();
    const old = (await h.global.db.select().from(hero_rank_score)).find(
      (row) => row.member === "owner",
    )!;
    const authority = await acquireRealmAuthority(h.db.db, 1, () => true);
    await h.db.db.update(score_act).set({ score: 7 }).where(eq(score_act.uid, "owner"));
    const source = createHeroRankSource(h.db.db, authority),
      projection = createHeroRankProjection(h.global.db, authority),
      service = new HeroRankPublicationService(
        source,
        projection,
        (rows) => h.cache.publishHeroRanking(rows),
        h.rules,
        () => h.clock.now,
      );
    await service.refresh();
    await expect(h.source.page(undefined, BigInt(h.clock.now))).rejects.toThrow();
    await expect(h.projection.write([old], BigInt(h.clock.now))).rejects.toThrow(
      "Stale global hero rank owner",
    );
    await h.cache.publishHeroRanking([old]);
    expect(Number(await h.cache.command("ZSCORE", old.rankKey, old.member))).toBe(-7);
    const current = (await h.global.db.select().from(hero_rank_score)).find(
      (row) => row.member === "owner",
    )!;
    await h.cache.publishHeroRanking([
      { ...current, ownerEpoch: 9007199254740993n, sequence: 9007199254740993n, score: 9 },
    ]);
    await h.cache.publishHeroRanking([
      { ...current, ownerEpoch: 9007199254740992n, sequence: 9223372036854775807n, score: 999 },
    ]);
    await h.cache.publishHeroRanking([
      { ...current, ownerEpoch: 9007199254740993n, sequence: 9007199254740992n, score: 888 },
    ]);
    expect(Number(await h.cache.command("ZSCORE", old.rankKey, old.member))).toBe(-9);
  } finally {
    await h.close();
  }
}, 120000);
test("failed hero projection and cache publication retry without losing a page or taking another realm's member", async () => {
  const h = await fixture();
  try {
    await h.global.db.execute(
      sql`create function opencok_global.reject_hero_rank() returns trigger language plpgsql as $$ begin raise exception 'synthetic hero rank rejection'; end $$`,
    );
    await h.global.db.execute(
      sql`create trigger reject_hero_rank before insert on opencok_global.hero_rank_score for each row execute function opencok_global.reject_hero_rank()`,
    );
    await expect(h.service.refresh()).rejects.toThrow();
    expect(await h.global.db.select().from(hero_rank_owner)).toHaveLength(0);
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(0);
    await h.global.db.execute(sql`drop trigger reject_hero_rank on opencok_global.hero_rank_score`);
    let failing = true;
    const service = new HeroRankPublicationService(
      h.source,
      h.projection,
      async (rows) => {
        if (failing) {throw new Error("Synthetic Redis loss");}
        await h.cache.publishHeroRanking(rows);
      },
      h.rules,
      () => h.clock.now,
    );
    await expect(service.refresh()).rejects.toThrow("Synthetic Redis loss");
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(2);
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(0);
    failing = false;
    await service.refresh();
    expect(await h.cache.heroRankingPosition(await h.lookup())).toBe(2);
    const own = (await h.global.db.select().from(hero_rank_score))[0]!;
    await expect(
      h.projection2.write([{ ...own, kingdomId: 2 }], BigInt(h.clock.now)),
    ).rejects.toThrow("Foreign hero rank member ownership");
    expect(
      (await h.global.db.select().from(hero_rank_score)).find((row) => row.member === own.member)!
        .kingdomId,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("hero publication preserves guild metadata, matched kingdom order and the 5000-member native board bound", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(alliance).values({
      uid: "guild",
      alliancename: "Synthetic guild",
      abbr: "SYN",
      icon: "1",
      createtime: BigInt(h.clock.now),
      bannerStyle: "",
    });
    await h.db.db.insert(hero_event).values([
      {
        uuid: "guild-event",
        eventId: "9001012",
        activityId: "guild-main",
        type: 2,
        rewardType: 2,
        startTime: BigInt(h.clock.now - 1000),
        endTime: BigInt(h.clock.now + 3600000),
      },
      {
        uuid: "kingdom-event",
        eventId: "9001024",
        activityId: "kingdom-main",
        type: 3,
        rewardType: 3,
        startTime: BigInt(h.clock.now - 1000),
        endTime: BigInt(h.clock.now + 3600000),
      },
    ]);
    await h.db.db.insert(score_act).values([
      { uid: "guild", actId: "guild-event", level: 0, score: 42, finishFlag: 0, rewardFlag: "" },
      { uid: "owner", actId: "kingdom-event", level: 0, score: 9, finishFlag: 0, rewardFlag: "" },
    ]);
    await h.service.refresh();
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(3);
    const guild = (await h.global.db.select().from(hero_rank_score)).find(
      (row) => row.member === "guild",
    )!;
    expect(JSON.parse(guild.metadata!)).toMatchObject({
      uid: "guild",
      name: "Synthetic guild",
      abbr: "SYN",
      icon: "1",
      server: 1,
    });
    expect((await h.cache.heroHistoryPublication([guild.rankKey], true))[0]!.members).toEqual([
      "guild",
    ]);
    await h.db.db
      .update(hero_event)
      .set({ serverGroup: "2|1" })
      .where(eq(hero_event.uuid, "kingdom-event"));
    await h.service.refresh();
    expect(
      (await h.global.db.select().from(hero_rank_score)).find((row) => row.type === 3)!.rankKey,
    ).toContain("_2|1_");
    expect(await h.cache.heroRankingPosition(await h.lookup("owner", 3))).toBe(1);
    const key = guild.rankKey;
    await h.cache.command("DEL", key);
    await h.cache.command(
      "ZADD",
      key,
      ...Array.from({ length: 5000 }, (_, index) => [String(index), `seed-${index}`]).flat(),
    );
    await h.cache.publishHeroRanking([{ ...guild, score: 10000, sequence: guild.sequence + 100n }]);
    expect(Number(await h.cache.command("ZCARD", key))).toBe(5000);
    expect(await h.cache.heroRankingPosition(await h.lookup("guild", 2))).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("hero publication bounds each refresh and advances its saved page cursor without skipping the tail", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(score_act).values(
      Array.from({ length: 255 }, (_, index) => ({
        uid: `synthetic-${String(index).padStart(3, "0")}`,
        actId: "left",
        level: 0,
        score: index,
        finishFlag: 0,
        rewardFlag: "",
      })),
    );
    await h.service.refresh();
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(256);
    await h.service.refresh();
    expect(await h.global.db.select().from(hero_rank_score)).toHaveLength(257);
  } finally {
    await h.close();
  }
}, 120000);
