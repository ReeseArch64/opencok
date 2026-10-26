import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { HeroCalendarService } from "@opencok/services/hero-calendar";
import { HeroMatchingService } from "@opencok/services/hero-matching";
import { createHeroCalendarStore } from "@opencok/repositories/hero-calendar";
import {
  createHeroMatchingRegistry,
  createHeroMatchingRealmStore,
} from "@opencok/repositories/hero-matching";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { heroMatchIdentity } from "@opencok/rules/hero-matching";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { hero_match_period } from "@opencok/drizzle/schema/opencok_global/hero_match_period";
import { hero_match_realm } from "@opencok/drizzle/schema/opencok_global/hero_match_realm";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness(),
    closers = [h.close];
  try {
    h.clock.now = Date.UTC(2023, 0, 2, 0, 1);
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
    const rules2 = await loadRules(undefined, 2),
      authority2 = await acquireRealmAuthority(second.db, 2, () => true),
      now = () => h.clock.now;
    const calendar = new HeroCalendarService(
        createHeroCalendarStore(h.db.db, h.authority, now),
        h.rules,
        now,
      ),
      calendar2 = new HeroCalendarService(
        createHeroCalendarStore(second.db, authority2, now),
        rules2,
        now,
      );
    await calendar.refresh();
    await calendar2.refresh();
    const registry = createHeroMatchingRegistry(global.db),
      realm = createHeroMatchingRealmStore(h.db.db, h.authority, now),
      realm2 = createHeroMatchingRealmStore(second.db, authority2, now),
      matching = new HeroMatchingService(realm, registry, h.rules, now, () => 9),
      matching2 = new HeroMatchingService(realm2, registry, rules2, now, () => 1);
    return {
      ...h,
      global,
      second,
      registry,
      realm,
      realm2,
      matching,
      matching2,
      calendar,
      calendar2,
      close: async () => {
        for (const close of closers.toReversed()) await close();
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) await close();
    throw error;
  }
}
test("two realms freeze one shared hero cohort, wait for admission closure and recover the same coupled match", async () => {
  const h = await fixture();
  try {
    await Promise.all([h.matching.refresh(), h.matching2.refresh(), h.matching.refresh()]);
    expect(await h.global.db.select().from(hero_match_period)).toHaveLength(1);
    const registrations = await h.global.db.select().from(hero_match_realm);
    expect(registrations).toHaveLength(2);
    expect(registrations.every((row) => row.matchedAt === 0n)).toBe(true);
    h.clock.now += 239999;
    await h.matching.refresh();
    expect(
      (await h.db.db.select().from(hero_activity)).find((row) => row.activityType === 3)!
        .serverGroup,
    ).toBeNull();
    h.clock.now++;
    await Promise.all([h.matching.refresh(), h.matching2.refresh()]);
    for (const db of [h.db, h.second]) {
      expect(
        (await db.db.select().from(hero_activity)).find((row) => row.activityType === 3)!
          .serverGroup,
      ).toBe("2|1");
      expect(
        (await db.db.select().from(hero_event))
          .filter((row) => [3, 4].includes(row.type!))
          .map((row) => row.serverGroup),
      ).toEqual(["2|1", "2|1"]);
    }
    const stable = await h.global.db.select().from(hero_match_realm);
    await h.matching.refresh();
    await h.matching2.refresh();
    expect(await h.global.db.select().from(hero_match_realm)).toEqual(stable);
    h.clock.now += 86400000;
    await h.calendar.refresh();
    await h.calendar2.refresh();
    await h.matching.refresh();
    await h.matching2.refresh();
    expect(await h.global.db.select().from(hero_match_period)).toHaveLength(2);
    expect(
      (await h.global.db.select().from(hero_match_realm)).filter((row) => row.matchedAt > 0n),
    ).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("hero matching preserves frozen power and configuration and rejects late realms without changing opponents", async () => {
  const h = await fixture();
  try {
    await h.matching.refresh();
    await h.matching2.refresh();
    const [period] = await h.global.db.select().from(hero_match_period),
      before = await h.global.db.select().from(hero_match_realm);
    h.rules.items.get("heroactivity")!.k3 = "40|3";
    h.clock.now += 240000;
    await h.matching.refresh();
    await h.registry.register({
      periodId: period!.id,
      definition: period!.definition,
      startTime: period!.startTime,
      endTime: period!.endTime,
      registeredAt: BigInt(h.clock.now),
      groupSize: 40,
      matchSize: 3,
      kingdomId: 3,
      power: 9000000000n,
      shuffle: 0,
    });
    expect(await h.registry.result(period!.id, 3)).toBeUndefined();
    expect(await h.global.db.select().from(hero_match_realm)).toHaveLength(2);
    expect((await h.global.db.select().from(hero_match_period))[0]).toMatchObject({
      groupSize: 30,
      matchSize: 2,
    });
    expect(
      (await h.global.db.select().from(hero_match_realm))
        .toSorted((a, b) => a.kingdomId - b.kingdomId)
        .map((row) => row.power),
    ).toEqual(before.toSorted((a, b) => a.kingdomId - b.kingdomId).map((row) => row.power));
    expect((await h.registry.result(period!.id, 1))!.serverGroup).toBe("2|1");
  } finally {
    await h.close();
  }
}, 120000);
test("hero global and local match failures roll back their entire transition and stale authorities cannot attach a group", async () => {
  const h = await fixture();
  try {
    await h.matching.refresh();
    await h.matching2.refresh();
    h.clock.now += 240000;
    const [period] = await h.global.db.select().from(hero_match_period);
    await h.global.db.execute(
      sql`create function opencok_global.reject_hero_match() returns trigger language plpgsql as $$ begin raise exception 'synthetic global match rejection'; end $$`,
    );
    await h.global.db.execute(
      sql`create trigger reject_hero_match before update on opencok_global.hero_match_realm for each row execute function opencok_global.reject_hero_match()`,
    );
    await expect(h.registry.match(period!.id, BigInt(h.clock.now))).rejects.toThrow();
    expect((await h.global.db.select().from(hero_match_period))[0]!.matchedAt).toBe(0n);
    expect(
      (await h.global.db.select().from(hero_match_realm)).every((row) => row.serverGroup === null),
    ).toBe(true);
    await h.global.db.execute(
      sql`drop trigger reject_hero_match on opencok_global.hero_match_realm`,
    );
    await h.registry.match(period!.id, BigInt(h.clock.now));
    const result = (await h.registry.result(period!.id, 1))!,
      main = (await h.db.db.select().from(hero_activity)).find((row) => row.activityType === 3)!;
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_hero_group() returns trigger language plpgsql as $$ begin raise exception 'synthetic local match rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_hero_group before update on opencok_kingdom.hero_event for each row execute function opencok_kingdom.reject_hero_group()`,
    );
    await expect(h.realm.apply(main.uuid, result)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(hero_activity).where(eq(hero_activity.uuid, main.uuid)))[0]!
        .serverGroup,
    ).toBeNull();
    await h.db.db.execute(sql`drop trigger reject_hero_group on opencok_kingdom.hero_event`);
    await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.realm.apply(main.uuid, result)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(hero_activity).where(eq(hero_activity.uuid, main.uuid)))[0]!
        .serverGroup,
    ).toBeNull();
    expect(result.periodId).toBe(heroMatchIdentity(main.activityId, main.startTime!));
  } finally {
    await h.close();
  }
}, 120000);
