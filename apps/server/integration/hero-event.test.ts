import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { readHeroEvents } from "@opencok/repositories/hero-event";
import { readHeroHistoryPresentation } from "@opencok/repositories/hero-ranking";
import { heroRankingLookup } from "@opencok/rules/hero-ranking";
import { Cache } from "@opencok/storage/session";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { server_activity } from "@opencok/drizzle/schema/opencok_kingdom/server_activity";
import { server_king_info } from "@opencok/drizzle/schema/opencok_global/server_king_info";
import { cityHarness } from "./support/city";
import { DisposableRedis } from "./support/redis";
const fields = (value: Value) => value.value as Fields;
async function fixture() {
  const h = await cityHarness(),
    redis = new DisposableRedis(),
    closers = [h.close, () => redis.stop()];
  try {
    h.clock.now = Date.UTC(2023, 0, 2, 12);
    const redisUrl = await redis.start(),
      cache = new Cache({ redisUrl, timeoutMs: 1000, kingdomId: 1 });
    await h.db.pool.query('CREATE DATABASE "hero_global"');
    await h.db.pool.query('CREATE DATABASE "hero_second"');
    const global = createDatabase("global", { ...h.connection, database: "hero_global" }),
      second = createDatabase("kingdom", { ...h.connection, database: "hero_second" });
    closers.push(global.close, second.close);
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    await migrate(second.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    for (const uid of ["owner", "visitor"])
      await second.db.insert(userprofile).values({
        uid,
        name: `Synthetic cross ${uid}`,
        serverId: 2,
        level: 1,
        exp: 0,
        country: "BR",
        crossFightSrcServerId: 1,
      });
    await global.db.insert(server_king_info).values([
      { Id: 1, name: "Home", banner: "home-banner" },
      { Id: 2, name: "Guest", banner: "guest-banner" },
    ]);
    h.rules.items.set("heroactivity_on", {
      id: "heroactivity_on",
      k1: "all",
      k2: "1.0.0",
      k3: "all",
      k4: "1.0.0",
      k5: "all",
      k6: "1.0.0",
      k7: "all",
      k8: "1.0.0",
      k9: "all",
      k10: "1.0.0",
    });
    h.rules.power.activityPanels!.clear();
    for (const [id, type] of [
      ["57001", "10"],
      ["57002", "12"],
      ["57003", "14"],
    ])
      h.rules.power.activityPanels!.set(id!, {
        id: id!,
        type: type!,
        function_on: "1",
        start: "2023-01-01-00-00",
        end: "2023-01-03-00-00",
        popup: "1",
        exchange: "0",
        androidmd5: "synthetic",
      });
    const start = BigInt(h.clock.now - 10000),
      end = BigInt(h.clock.now + 3600000);
    await h.db.db.insert(hero_activity).values({
      uuid: "personal-main",
      activityId: "9000000",
      activityType: 1,
      startTime: start,
      endTime: end,
      roundTime: 7200000n,
      finish: 0,
    });
    await h.db.db.insert(hero_event).values({
      uuid: "personal-event",
      eventId: "9001000",
      activityId: "personal-main",
      type: 1,
      rewardType: 1,
      readyTime: start - 600000n,
      startTime: start,
      endTime: end,
      lastTime: 3600000n,
    });
    await h.db.db.insert(score_act).values([
      {
        uid: "owner",
        actId: "personal-event",
        level: 0,
        score: 55,
        finishFlag: 1,
        rewardFlag: "2,0,2",
      },
      {
        uid: "other",
        actId: "personal-event",
        level: 0,
        score: 999,
        finishFlag: 0,
        rewardFlag: "",
      },
    ]);
    const game = (realm = 1) =>
      new GameService(
        {
          async getProfileById(uid: string) {
            return (
              await (realm === 1 ? h.db : second).db
                .select()
                .from(userprofile)
                .where(eq(userprofile.uid, uid))
            )[0];
          },
          async heroEvents(uid, selected, selection, now) {
            if (selected !== 1 && selected !== 2) throw new Error("Unconfigured synthetic realm");
            return readHeroEvents((selected === 1 ? h.db : second).db, uid, selection, now);
          },
          heroHistoryPresentation: (alliances, realms) =>
            readHeroHistoryPresentation(global.db, alliances, realms),
        } as Pick<
          GameStore,
          "getProfileById" | "heroEvents" | "heroHistoryPresentation"
        > as GameStore,
        h.rules,
        { kingdomId: realm },
        () => h.clock.now,
        { heroRankingPosition: (query) => cache.heroRankingPosition(query) },
      );
    const rank = async (id: string, owner = "owner") => {
      const event = (await h.db.db.select().from(hero_event).where(eq(hero_event.uuid, id)))[0]!,
        profile = (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!,
        query = heroRankingLookup(event, owner, profile.allianceId ?? "", h.rules, 1, "12.06.0");
      if (typeof query === "number") throw new Error("Unexpected synthetic ranking gate");
      await cache.command("ZADD", query.keys[0]!, "-1000", "ahead", "-55", query.member);
      return query.keys[0]!;
    };
    return {
      ...h,
      global,
      second,
      cache,
      game,
      rank,
      async close() {
        for (const close of closers.toReversed()) await close();
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) await close();
    throw error;
  }
}
test("hero event queries retain the owned score, full reward previews and real Redis rank without changing stored progress", async () => {
  const h = await fixture();
  try {
    const key = await h.rank("personal-event"),
      before = await h.db.db.select().from(score_act),
      reply = await h.game().execute("owner", "hero.event.info.get", {
        activityId: sfs.string("9000000"),
        _cok_: sfs.long(9007199254740993n),
      }),
      events = reply.body.eventList!.value as Value[],
      entry = fields(events[0]!);
    expect(reply.body._cok_).toEqual(sfs.long(9007199254740993n));
    expect(reply.body.ranking).toEqual(sfs.int(2));
    expect(events).toHaveLength(1);
    expect(Object.keys(entry)).toEqual([
      "eventId",
      "actId",
      "t",
      "st",
      "et",
      "score",
      "value",
      "reward",
      "target",
      "userScore",
    ]);
    expect(fields(entry.userScore!)).toMatchObject({
      uid: sfs.string("owner"),
      score: sfs.int(55),
      finishFlag: sfs.int(1),
      rewardFlagList: sfs.string("0,2"),
    });
    expect(entry.reward!.value).toHaveLength(3);
    expect(await h.db.db.select().from(score_act)).toEqual(before);
    expect(Number(await h.cache.command("ZCARD", key))).toBe(2);
    expect(Number(await h.cache.command("TTL", key))).toBe(-1);
    const ranked = await h
      .game()
      .execute("owner", "hero.event.ranking.get", { actId: sfs.string("personal-event") });
    expect(ranked.body.rewardArr?.value).toBeString();
    expect(ranked.body.reward!.value).not.toHaveLength(0);
    const scoped = await readHeroEvents(h.db.db, "owner", { activityId: "9000000" }, h.clock.now);
    expect(scoped.scores.map((row) => row.uid)).toEqual(["owner"]);
  } finally {
    await h.close();
  }
}, 120000);
test("kingdom hero views use the persisted alliance band and preserve the configured kingdom order and metadata", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "guild" })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(alliance_member).values({ uid: "owner", allianceId: "guild", rank: 5 });
    await h.db.db.update(playerinfo).set({ power: 5000000n }).where(eq(playerinfo.uid, "owner"));
    await h.db.db.insert(hero_activity).values({
      uuid: "kingdom-main",
      activityId: "9000002",
      activityType: 3,
      startTime: BigInt(h.clock.now - 10000),
      endTime: BigInt(h.clock.now + 3600000),
      finish: 0,
    });
    await h.db.db.insert(hero_event).values({
      uuid: "alliance-event",
      eventId: "9001025",
      activityId: "kingdom-main",
      type: 4,
      rewardType: 4,
      startTime: BigInt(h.clock.now - 1000),
      endTime: BigInt(h.clock.now + 3600000),
      serverGroup: "2|1",
    });
    await h.db.db.insert(score_act).values({
      uid: "guild",
      actId: "alliance-event",
      level: 0,
      score: 55,
      finishFlag: 0,
      rewardFlag: "0",
    });
    await h.rank("alliance-event");
    const reply = await h
      .game()
      .execute("owner", "hero.event.info.get", { activityId: sfs.string("9000002") });
    expect(reply.body.rankingAlliance).toEqual(sfs.int(2));
    const countries = reply.body.vsCountry!.value as Value[];
    expect(countries.map((row) => fields(row).id!.value)).toEqual([2, 1]);
    expect(fields(countries[0]!).banner).toEqual(sfs.string("guest-banner"));
    const entry = fields((reply.body.eventList!.value as Value[])[0]!);
    expect(fields(entry.userScore!).uid).toEqual(sfs.string("guild"));
  } finally {
    await h.close();
  }
}, 120000);
test("cross-hero reads resolve only the authenticated home realm and hide absent or banned home characters", async () => {
  const h = await fixture();
  try {
    await h.rank("personal-event");
    const cross = h.game(2);
    const details = await cross.execute("owner", "hero.event.info.get", {
      activityId: sfs.string("9000000"),
      serverId: sfs.int(99),
    });
    expect(details.body.eventList!.value).toHaveLength(1);
    const panel = await cross.execute("owner", "hero.cross.info", {});
    expect(panel.body.activity!.value).toHaveLength(3);
    const absent = await cross.execute("visitor", "hero.event.info.get", {
      activityId: sfs.string("9000000"),
    });
    expect(absent.body.eventList).toBeUndefined();
    await h.db.db
      .update(userprofile)
      .set({ banFlag: 1, banTime: BigInt(h.clock.now + 3600000) })
      .where(eq(userprofile.uid, "owner"));
    expect(
      (await cross.execute("owner", "hero.event.info.get", { activityId: sfs.string("9000000") }))
        .body.eventList,
    ).toBeUndefined();
    expect((await h.game().execute("other", "hero.cross.info", {})).body.activity).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("hero projections omit expired periods and missing alliance bands while stronger-lord activity suppresses upcoming panels", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(server_activity).values({
      uid: "lord",
      id: 1,
      startTime: BigInt(h.clock.now - 1000),
      endTime: BigInt(h.clock.now + 7200000),
    });
    expect(
      (await h.game(2).execute("owner", "hero.cross.info", {})).body.activity!.value,
    ).toHaveLength(1);
    h.clock.now += 3600001;
    expect(
      (
        await h
          .game()
          .execute("owner", "hero.event.info.get", { activityId: sfs.string("9000000") })
      ).body.eventList,
    ).toBeUndefined();
    expect(
      (
        await h
          .game()
          .execute("owner", "hero.event.ranking.get", { actId: sfs.string("personal-event") })
      ).body.reward,
    ).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
