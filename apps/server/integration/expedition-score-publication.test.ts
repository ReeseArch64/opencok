import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { ExpeditionMatchingService } from "@opencok/services/expedition-matching";
import { ExpeditionPhaseService } from "@opencok/services/expedition-phase";
import {
  ExpeditionScorePublicationService,
  ExpeditionLiveViewService,
} from "@opencok/services/expedition-score-publication";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import {
  createExpeditionMatchingRegistry,
  createExpeditionMatchingRealmStore,
} from "@opencok/repositories/expedition-matching";
import { createExpeditionPhaseStore } from "@opencok/repositories/expedition-phase";
import {
  createExpeditionScoreSource,
  createExpeditionScoreProjection,
  createExpeditionLiveSource,
} from "@opencok/repositories/expedition-score-publication";
import { installExpeditionPeriod } from "@opencok/repositories/new-expedition";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { expeditionDiscovery } from "@opencok/rules/expedition-score-publication";
import { expeditionDomain } from "@opencok/services/new-expedition";
import { trainingDomain } from "@opencok/services/training";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { expedition_manifest } from "@opencok/drizzle/schema/opencok_kingdom/expedition_manifest";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { expedition_score } from "@opencok/drizzle/schema/opencok_global/expedition_score";
import { expedition_score_owner } from "@opencok/drizzle/schema/opencok_global/expedition_score_owner";
import { Cache } from "@opencok/storage/session";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";
async function fixture() {
  const h = await cityHarness([expeditionDomain, trainingDomain]),
    redis = new DisposableRedis(),
    closers = [h.close, () => redis.stop()];
  try {
    h.clock.now = Date.UTC(2040, 0, 1);
    const redisUrl = await redis.start(),
      cache = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 1 }),
      cache2 = new Cache({ redisUrl, timeoutMs: 3000, kingdomId: 2 });
    await h.db.pool.query('CREATE DATABASE "expedition_score_global"');
    await h.db.pool.query('CREATE DATABASE "expedition_score_second"');
    const global = createDatabase("global", {
        ...h.connection,
        database: "expedition_score_global",
      }),
      second = createDatabase("kingdom", { ...h.connection, database: "expedition_score_second" });
    closers.push(global.close, second.close);
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    await migrate(second.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const rules2 = await loadRules(undefined, 2),
      authority2 = await acquireRealmAuthority(second.db, 2, () => true),
      now = () => h.clock.now,
      calendar = new ExpeditionCalendarService(
        createExpeditionCalendarStore(global.db),
        h.rules,
        [1, 2],
        now,
      ),
      period = (await calendar.refresh())!,
      schedule = expeditionCalendarPhases(period),
      registry = createExpeditionMatchingRegistry(global.db),
      matching = new ExpeditionMatchingService(
        calendar,
        createExpeditionMatchingRealmStore(h.db.db, h.authority, now),
        registry,
        h.rules,
        now,
      ),
      matching2 = new ExpeditionMatchingService(
        new ExpeditionCalendarService(
          createExpeditionCalendarStore(global.db),
          rules2,
          [1, 2],
          now,
        ),
        createExpeditionMatchingRealmStore(second.db, authority2, now),
        registry,
        rules2,
        now,
      );
    h.clock.now = Number(schedule[1]!.startTime);
    await matching.refresh();
    await matching2.refresh();
    h.clock.now = Number(schedule[1]!.endTime);
    await matching.refresh();
    await matching2.refresh();
    h.clock.now = Number(schedule.find((row) => row.stage === 7)!.startTime);
    await new ExpeditionPhaseService(
      calendar,
      createExpeditionPhaseStore(h.db.db, h.authority, now),
    ).refresh();
    await new ExpeditionPhaseService(
      calendar,
      createExpeditionPhaseStore(second.db, authority2, now),
    ).refresh();
    await h.db.db.update(userprofile).set({ allianceId: "guild" });
    await second.db.insert(userprofile).values({
      uid: "remote",
      name: "Synthetic Remote",
      country: "BR",
      serverId: 2,
      level: 1,
      exp: 0,
      allianceId: "guild",
    });
    await h.command("army.add", {
      id: sfs.string("107000"),
      num: sfs.int(5),
      gold: sfs.bool(false),
    });
    await h.finish(1);
    await h.db.db
      .insert(expedition_progress)
      .values({ uid: "other", periodId: String(period.id), stage: 7, score: 25, takeReward: "" });
    await second.db
      .insert(expedition_progress)
      .values({ uid: "remote", periodId: String(period.id), stage: 7, score: 40, takeReward: "" });
    const source = createExpeditionScoreSource(h.db.db, h.authority),
      source2 = createExpeditionScoreSource(second.db, authority2),
      projection = createExpeditionScoreProjection(global.db, h.authority),
      projection2 = createExpeditionScoreProjection(global.db, authority2),
      publish = new ExpeditionScorePublicationService(
        source,
        projection,
        (clock, version, at) =>
          cache.publishExpeditionDiscovery(expeditionDiscovery(clock, version, at)),
        now,
      ),
      publish2 = new ExpeditionScorePublicationService(
        source2,
        projection2,
        (clock, version, at) =>
          cache2.publishExpeditionDiscovery(expeditionDiscovery(clock, version, at)),
        now,
      ),
      live = new ExpeditionLiveViewService(
        createExpeditionLiveSource(h.db.db, global.db, h.authority),
        now,
      );
    return {
      ...h,
      global,
      second,
      authority2,
      period,
      schedule,
      source,
      source2,
      projection,
      projection2,
      publish,
      publish2,
      cache,
      cache2,
      live,
      close: async () => {
        for (const close of closers.toReversed()) {await close();}
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) {await close();}
    throw error;
  }
}
test("confirmed expedition scores publish shared ranks and scoped guild totals while native discovery follows the owned phase", async () => {
  const h = await fixture();
  try {
    const before = await h.command("newexpidition.activityinfo", {});
    expect((await h.live.enrich("owner", before.body)).rank).toEqual(sfs.int(-1));
    await h.publish.refresh();
    await h.publish2.refresh();
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(3);
    const body = await h.live.enrich("owner", before.body);
    expect(body.score).toEqual(sfs.string("25"));
    expect(body.rank).toEqual(sfs.int(2));
    expect(body.alliancescore).toEqual(sfs.double(50));
    const kingdoms = body.kingdominfolist!.value as Value[];
    expect(fields(kingdoms[0]).score).toEqual(sfs.string("50"));
    expect(fields(kingdoms[1]).score).toEqual(sfs.string("40"));
    expect(await h.cache.expeditionStage()).toBe(7);
    expect(await h.cache.expeditionStage(2)).toBe(7);
  } finally {
    await h.close();
  }
}, 120000);
test("absolute republication updates facts and metadata without adding duplicate points or transferring another realm's guild score", async () => {
  const h = await fixture();
  try {
    await h.publish.refresh();
    await h.publish2.refresh();
    await h.db.db
      .update(expedition_progress)
      .set({ score: 50 })
      .where(eq(expedition_progress.uid, "owner"));
    await h.db.db
      .update(userprofile)
      .set({ name: "Renamed Synthetic" })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "departed" })
      .where(eq(userprofile.uid, "other"));
    await h.publish.refresh();
    await h.publish.refresh();
    const scores = await h.global.db.select().from(expedition_score);
    expect(scores).toHaveLength(3);
    const owner = scores.find((row) => row.member === "owner")!;
    expect(owner.score).toBe(50);
    expect(JSON.parse(owner.metadata!).name).toBe("Renamed Synthetic");
    const base = (await h.command("newexpidition.activityinfo", {})).body,
      body = await h.live.enrich("owner", base);
    expect(body.rank).toEqual(sfs.int(1));
    expect(body.alliancescore).toEqual(sfs.double(50));
    expect(fields((body.kingdominfolist!.value as Value[])[0]).score).toEqual(sfs.string("75"));
  } finally {
    await h.close();
  }
}, 120000);
test("authority replacement fences global facts and Redis discovery retains exact versions above Number precision and after loss", async () => {
  const h = await fixture();
  try {
    await h.publish.refresh();
    const rows = await h.source.page(undefined, BigInt(h.clock.now)),
      oldOwner = (await h.global.db.select().from(expedition_score_owner))[0]!,
      clock = (await h.source.clock())!,
      old = expeditionDiscovery(
        clock,
        { kingdomId: 1, ownerEpoch: oldOwner.ownerEpoch, sequence: oldOwner.sequence },
        BigInt(h.clock.now),
      ),
      replacement = await acquireRealmAuthority(h.db.db, 1, () => true),
      source = createExpeditionScoreSource(h.db.db, replacement),
      projection = createExpeditionScoreProjection(h.global.db, replacement);
    const next = new ExpeditionScorePublicationService(
      source,
      projection,
      (clock, version, at) =>
        h.cache.publishExpeditionDiscovery(expeditionDiscovery(clock, version, at)),
      () => h.clock.now,
    );
    await next.refresh();
    await expect(h.projection.write(rows, BigInt(h.clock.now))).rejects.toThrow(
      "Stale global expedition publisher",
    );
    expect(await h.cache.publishExpeditionDiscovery(old)).toBe(false);
    await h.global.db
      .update(expedition_score_owner)
      .set({ sequence: 9007199254740992n })
      .where(eq(expedition_score_owner.kingdomId, 1));
    await next.refresh();
    const raw = JSON.parse(
      (await h.cache.command("GET", "opencok:global:expedition-match:1")) as string,
    );
    expect(raw.sequence).toBe("9007199254740993");
    await h.cache.command("FLUSHDB");
    await next.refresh();
    expect(await h.cache.expeditionStage()).toBe(7);
    expect(
      (await h.global.db.select().from(expedition_score)).every(
        (row) => row.ownerEpoch === replacement.epoch,
      ),
    ).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("a failed shared score batch restores its owner version and facts before the same page is retried", async () => {
  const h = await fixture();
  try {
    await h.global.db.execute(
      sql`create function opencok_global.reject_expedition_score() returns trigger language plpgsql as $$ begin raise exception 'synthetic publication rejection'; end $$`,
    );
    await h.global.db.execute(
      sql`create trigger reject_expedition_score before insert on opencok_global.expedition_score for each row execute function opencok_global.reject_expedition_score()`,
    );
    await expect(h.publish.refresh()).rejects.toThrow();
    expect(await h.global.db.select().from(expedition_score_owner)).toHaveLength(0);
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(0);
    await h.global.db.execute(
      sql`drop trigger reject_expedition_score on opencok_global.expedition_score`,
    );
    await h.publish.refresh();
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("Redis failure does not stop canonical score pages and retry rebuilds discovery without adding points", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(expedition_progress).values(
      Array.from({ length: 70 }, (_, index) => ({
        uid: `synthetic-${String(index).padStart(3, "0")}`,
        periodId: String(h.period.id),
        stage: 7,
        score: 1,
        takeReward: "",
      })),
    );
    const failing = new ExpeditionScorePublicationService(
      h.source,
      h.projection,
      async () => {
        throw new Error("synthetic Redis outage");
      },
      () => h.clock.now,
    );
    await expect(failing.refresh()).rejects.toThrow("synthetic Redis outage");
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(72);
    await h.publish.refresh();
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(72);
    expect(await h.cache.expeditionStage()).toBe(7);
  } finally {
    await h.close();
  }
}, 120000);
test("rollover preserves the prior manifest and pending score facts and migration backfill retains foreign realm rows", async () => {
  const h = await fixture();
  try {
    const [prior] = await h.db.db.select().from(expedition_period);
    await h.db.db.insert(expedition_period).values({ ...prior!, serverId: 2, matchServerId: 1 });
    await h.db.db.execute(sql`drop table opencok_kingdom.expedition_manifest`);
    await h.db.pool.query(
      await Bun.file(
        new URL(
          "../../../packages/drizzle/migrations/kingdom/0036_expedition_manifests.sql",
          import.meta.url,
        ),
      ).text(),
    );
    expect(await h.db.db.select().from(expedition_manifest)).toHaveLength(2);
    expect(
      (await h.db.db.select().from(expedition_manifest)).every((row) => row.recordedAt === 0n),
    ).toBe(true);
    const start = prior!.endTime + 1n;
    await h.db.db.transaction((tx) =>
      installExpeditionPeriod(
        tx,
        h.authority,
        {
          serverId: 1,
          periodId: "next-period",
          matchServerId: 2,
          startTime: start,
          stages: [{ stage: 7, durationMs: 100000n }],
        },
        async () => true,
        start,
      ),
    );
    h.clock.now = Number(start) + 1;
    const rows = await h.source.page(undefined, BigInt(h.clock.now));
    expect(rows).toHaveLength(2);
    expect(rows.every((row) => row.periodId === prior!.periodId && row.kingdomId === 1)).toBe(true);
    await h.publish.refresh();
    expect(await h.global.db.select().from(expedition_score)).toHaveLength(2);
    expect(await h.db.db.select().from(expedition_manifest)).toHaveLength(3);
  } finally {
    await h.close();
  }
}, 120000);
test("a foreign member collision cannot overwrite another realm's published score or advance the local version", async () => {
  const h = await fixture();
  try {
    await h.publish.refresh();
    await h.publish2.refresh();
    const [row] = (await h.source.page(undefined, BigInt(h.clock.now))).filter(
        (row) => row.member === "owner",
      ),
      before = await h.global.db.select().from(expedition_score_owner);
    await expect(
      h.projection.write([{ ...row!, member: "remote", score: 1000000 }], BigInt(h.clock.now)),
    ).rejects.toThrow("Foreign or stale expedition score member");
    expect(
      (await h.global.db.select().from(expedition_score)).find((row) => row.member === "remote")!
        .score,
    ).toBe(40);
    expect(await h.global.db.select().from(expedition_score_owner)).toEqual(before);
  } finally {
    await h.close();
  }
}, 120000);
