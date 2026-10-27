import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { HeroRankingFinalityService } from "@opencok/hero/services/hero-ranking-finality";
import {
  HeroRankingRewardService,
  heroRankingRewardDomain,
} from "@opencok/hero/services/hero-ranking-rewards";
import {
  createHeroRankFinalityRealm,
  createHeroRankFinalityRegistry,
} from "@opencok/hero/repositories/hero-ranking-finality";
import { createHeroRankProjection } from "@opencok/hero/repositories/hero-rank-publication";
import {
  createHeroRankRewardStore,
  createHeroRankRewardStandings,
} from "@opencok/hero/repositories/hero-ranking-rewards";
import { heroRankAwardOperation } from "@opencok/hero/rules/hero-ranking-rewards";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { sfs, str, decode, fields } from "@opencok/messages/sfs";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { score_act_in } from "@opencok/drizzle/schema/opencok_kingdom/score_act_in";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { hero_rank_award } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_award";
import { hero_rank_closure } from "@opencok/drizzle/schema/opencok_kingdom/hero_rank_closure";
import { hero_event_reward_record } from "@opencok/drizzle/schema/opencok_kingdom/hero_event_reward_record";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { cityHarness } from "./support/city";
async function fixture(type = 1) {
  const h = await cityHarness([heroRankingRewardDomain]);
  let global: ReturnType<typeof createDatabase<"global">> | undefined;
  try {
    await h.db.pool.query('CREATE DATABASE "hero_reward_global"');
    global = createDatabase("global", { ...h.connection, database: "hero_reward_global" });
    await migrate(global.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    const end = 2000000n;
    await h.db.db.insert(hero_activity).values({
      uuid: "main",
      activityId: "9000000",
      activityType: 1,
      startTime: 1n,
      endTime: end,
      roundTime: 2000000n,
      finish: 0,
      alreadyEvent: "",
    });
    await h.db.db.insert(hero_event).values({
      uuid: "event",
      eventId: "9001000",
      activityId: "main",
      type,
      rewardType: type,
      startTime: 1n,
      endTime: end,
      rewardStatus: 0,
    });
    for (const [uid, score] of (type === 1
      ? [
          ["owner", 200],
          ["other", 100],
        ]
      : [["guild", 200]]) as [string, number][])
      {await h.db.db
        .insert(score_act)
        .values({ uid, actId: "event", level: 0, score, finishFlag: 0, rewardFlag: "" });}
    if (type === 2) {
      await h.db.db.update(userprofile).set({ allianceId: "guild" });
      await h.db.db
        .insert(score_act_in)
        .values(
          ["owner", "other"].map((uid) => ({ uid, actId: "event", allianceId: "guild", score: 1 })),
        );
    }
    const finality = new HeroRankingFinalityService(
      createHeroRankFinalityRealm(h.db.db, h.authority),
      createHeroRankFinalityRegistry(global.db, h.authority),
      createHeroRankProjection(global.db, h.authority),
      h.rules,
      [1],
      () => h.clock.now,
    );
    const store = createHeroRankRewardStore(h.db.db, h.authority),
      standings = createHeroRankRewardStandings(global.db, 1),
      deliver = (owner: string, id: string) =>
        h.command(
          "hero.rank.deliver",
          { awardId: sfs.string(id), operationId: sfs.string(heroRankAwardOperation(id)) },
          owner,
        );
    const service = () =>
      new HeroRankingRewardService(store, standings, h.rules, deliver, () => h.clock.now);
    const seal = async () => {
      h.clock.now = Number(end) + 300000;
      await finality.refresh();
      await finality.refresh();
      expect((await h.db.db.select().from(hero_rank_closure))[0]!.phase).toBe(2);
    };
    return {
      ...h,
      global,
      store,
      standings,
      deliver,
      service,
      seal,
      close: async () => {
        await global!.close();
        await h.close();
      },
    };
  } catch (error) {
    await global?.close();
    await h.close();
    throw error;
  }
}
test("frozen personal standings create funded native mail, history and durable publication exactly once", async () => {
  const h = await fixture();
  try {
    await h.seal();
    await h.service().refresh();
    await h.service().refresh();
    const messages = await h.db.db.select().from(mail),
      awards = await h.db.db.select().from(hero_rank_award);
    expect(messages).toHaveLength(2);
    expect(awards.every((x) => x.deliveredAt > 0n)).toBe(true);
    expect(
      (await h.db.db.select().from(hero_event_reward_record))
        .map((x) => [x.uid, x.allianceId, x.rank])
        .sort(),
    ).toEqual([
      ["other", "other", 2],
      ["owner", "owner", 1],
    ]);
    const award = awards.find((x) => x.ownerUid === "owner")!,
      message = messages.find((x) => x.toUser === "owner")!;
    expect(message.rewardId).toBe(award.pinnedReward);
    expect(message.rewardStatus).toBe(0);
    await h.deliver("owner", award.id);
    expect(await h.db.db.select().from(mail)).toEqual(messages);
    const events = (await h.db.db.select().from(mutation_outbox)).filter(
      (x) => x.eventType === "hero.rank.mail",
    );
    expect(events).toHaveLength(2);
    const payload = decode(events.find((x) => x.ownerUid === "owner")!.payload);
    expect(str(payload, "owner")).toBe("owner");
    expect(str(fields(payload.mail), "uid")).toBe(message.uid);
    const claims = new MailRewardService(
      createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
      h.rules,
    );
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(message.uid),
      operationId: sfs.string(randomUUID()),
    });
    const items = await h.db.db.select().from(user_item);
    expect(items.length).toBeGreaterThan(0);
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(message.uid),
      operationId: sfs.string(randomUUID()),
    });
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect((await h.db.db.select().from(hero_rank_closure))[0]!.phase).toBe(3);
  } finally {
    await h.close();
  }
}, 120000);
test("guild prizes include current contributors and retain independently pinned entitlements across restart", async () => {
  const h = await fixture(2);
  try {
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "departed" })
      .where(eq(userprofile.uid, "other"));
    await h.seal();
    const planner = new HeroRankingRewardService(
      h.store,
      h.standings,
      h.rules,
      async () => {
        throw new Error("offline recovery");
      },
      () => h.clock.now,
    );
    await planner.refresh();
    const [award] = await h.db.db.select().from(hero_rank_award);
    expect(award!.ownerUid).toBe("owner");
    expect(award!.member).toBe("guild");
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    const pinned = award!.pinnedReward;
    h.rules.ranking.heroEvents!.clear();
    h.clock.now += 60000;
    await h.service().refresh();
    const [message] = await h.db.db.select().from(mail);
    expect(message!.rewardId).toBe(pinned);
    expect(message!.toUser).toBe("owner");
    expect((await h.db.db.select().from(hero_event_reward_record))[0]!.allianceId).toBe("guild");
  } finally {
    await h.close();
  }
}, 120000);
test("a failed delivery receipt rolls back mail, history, acknowledgement and publication before recovery", async () => {
  const h = await fixture();
  try {
    await h.seal();
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_hero_award_receipt() returns trigger language plpgsql as $$ begin raise exception 'synthetic receipt rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_hero_award_receipt before insert on opencok_kingdom.command_receipt for each row execute function opencok_kingdom.reject_hero_award_receipt()`,
    );
    await h.service().refresh();
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    expect(await h.db.db.select().from(hero_event_reward_record)).toHaveLength(0);
    expect((await h.db.db.select().from(hero_rank_award)).every((x) => x.deliveredAt === 0n)).toBe(
      true,
    );
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (x) => x.eventType === "hero.rank.mail",
      ),
    ).toHaveLength(0);
    await h.db.db.execute(
      sql`drop trigger reject_hero_award_receipt on opencok_kingdom.command_receipt`,
    );
    h.clock.now += 60000;
    await h.service().refresh();
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("banned owners defer without blocking eligible players and legacy personal records prevent duplicate mail", async () => {
  const h = await fixture();
  try {
    await h.seal();
    await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(hero_event_reward_record).values({
      uid: "other",
      allianceId: "",
      eventId: "event",
      rank: 2,
      level: 0,
      rewardId: "legacy",
      time: 1n,
    });
    await h.service().refresh();
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(hero_rank_award)).find((x) => x.ownerUid === "other")!
        .deliveredAt,
    ).toBeGreaterThan(0n);
    await h.db.db.update(userprofile).set({ banFlag: 0 }).where(eq(userprofile.uid, "owner"));
    h.clock.now += 60000;
    await h.service().refresh();
    expect((await h.db.db.select().from(mail)).map((x) => x.toUser)).toEqual(["owner"]);
  } finally {
    await h.close();
  }
}, 120000);
test("award admission rolls back its cursor and resumes while unavailable shared standings do not block stored delivery", async () => {
  const h = await fixture();
  try {
    await h.seal();
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_hero_award() returns trigger language plpgsql as $$ begin raise exception 'synthetic entitlement rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_hero_award before insert on opencok_kingdom.hero_rank_award for each row execute function opencok_kingdom.reject_hero_award()`,
    );
    await expect(h.service().refresh()).rejects.toThrow();
    expect((await h.db.db.select().from(hero_rank_closure))[0]!.awardCursor).toBe("");
    expect(await h.db.db.select().from(hero_rank_award)).toHaveLength(0);
    await h.db.db.execute(sql`drop trigger reject_hero_award on opencok_kingdom.hero_rank_award`);
    await new HeroRankingRewardService(
      h.store,
      h.standings,
      h.rules,
      async () => {
        throw new Error("restart");
      },
      () => h.clock.now,
    ).refresh();
    h.clock.now += 60000;
    await expect(
      new HeroRankingRewardService(
        h.store,
        {
          page: async () => {
            throw new Error("shared unavailable");
          },
        },
        h.rules,
        h.deliver,
        () => h.clock.now,
      ).refresh(),
    ).rejects.toThrow("shared unavailable");
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
    const [award] = await h.db.db.select().from(hero_rank_award);
    await expect(
      h.deliver(award!.ownerUid === "owner" ? "other" : "owner", award!.id),
    ).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("rank award admission advances bounded member pages and never invents recipients for absent profiles", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(score_act).values(
      Array.from({ length: 68 }, (_, i) => ({
        uid: `synthetic-${String(i).padStart(3, "0")}`,
        actId: "event",
        level: 0,
        score: 50,
        finishFlag: 0,
        rewardFlag: "",
      })),
    );
    await h.seal();
    await h.service().refresh();
    expect((await h.db.db.select().from(hero_rank_closure))[0]).toMatchObject({
      phase: 2,
      awardCursor: "synthetic-061",
    });
    await h.service().refresh();
    await h.service().refresh();
    expect((await h.db.db.select().from(hero_rank_closure))[0]!.phase).toBe(3);
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
    expect(await h.db.db.select().from(hero_rank_award)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
