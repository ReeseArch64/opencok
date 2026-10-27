import { trainingDomain } from "@opencok/services/training";
import { sfs } from "@opencok/messages/sfs";
import { expedition_progress } from "@opencok/drizzle/schema/opencok_kingdom/expedition_progress";
import { createHeroCalendarStore } from "@opencok/hero/repositories/hero-calendar";
import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { ExpeditionMatchingService } from "@opencok/services/expedition-matching";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import {
  createExpeditionMatchingRegistry,
  createExpeditionMatchingRealmStore,
} from "@opencok/repositories/expedition-matching";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { expeditionMatchingConfiguration } from "@opencok/rules/expedition-matching";
import { expeditionDomain } from "@opencok/services/new-expedition";
import { hero_activity } from "@opencok/drizzle/schema/opencok_kingdom/hero_activity";
import { expedition_period } from "@opencok/drizzle/schema/opencok_kingdom/expedition_period";
import { expedition_admission } from "@opencok/drizzle/schema/opencok_kingdom/expedition_admission";
import { expedition_match_realm } from "@opencok/drizzle/schema/opencok_global/expedition_match_realm";
import { expedition_match_batch } from "@opencok/drizzle/schema/opencok_global/expedition_match_batch";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([expeditionDomain, trainingDomain]),
    closers = [h.close];
  try {
    h.clock.now = Date.UTC(2040, 0, 1);
    await h.db.pool.query('CREATE DATABASE "expedition_shared"');
    await h.db.pool.query('CREATE DATABASE "expedition_second"');
    const global = createDatabase("global", { ...h.connection, database: "expedition_shared" }),
      second = createDatabase("kingdom", { ...h.connection, database: "expedition_second" });
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
      clock = () => h.clock.now,
      calendar = new ExpeditionCalendarService(
        createExpeditionCalendarStore(global.db),
        h.rules,
        [1, 2],
        clock,
      ),
      period = (await calendar.refresh())!,
      window = expeditionCalendarPhases(period).find((row) => row.stage === 1)!;
    const realm = createExpeditionMatchingRealmStore(h.db.db, h.authority, clock),
      realm2 = createExpeditionMatchingRealmStore(second.db, authority2, clock),
      registry = createExpeditionMatchingRegistry(global.db);
    const service = () => new ExpeditionMatchingService(calendar, realm, registry, h.rules, clock),
      service2 = () =>
        new ExpeditionMatchingService(
          new ExpeditionCalendarService(
            createExpeditionCalendarStore(global.db),
            rules2,
            [1, 2],
            clock,
          ),
          realm2,
          registry,
          rules2,
          clock,
        );
    return {
      ...h,
      global,
      second,
      rules2,
      authority2,
      calendar,
      period,
      window,
      realm,
      realm2,
      registry,
      service,
      service2,
      close: async () => {
        for (const close of closers.toReversed()) await close();
      },
    };
  } catch (error) {
    for (const close of closers.toReversed()) await close();
    throw error;
  }
}
test("confirmed realms freeze reciprocal expedition opponents and install the same owned stage schedule once", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.service().refresh();
    await h.service2().refresh();
    expect(await h.global.db.select().from(expedition_match_realm)).toHaveLength(2);
    expect(await h.db.db.select().from(expedition_period)).toHaveLength(0);
    h.clock.now = Number(h.window.endTime);
    await h.service().refresh();
    await h.service2().refresh();
    const [first] = await h.db.db.select().from(expedition_period),
      [second] = await h.second.db.select().from(expedition_period);
    expect(first).toMatchObject({ periodId: h.period.id, matchServerId: 2, count: 1 });
    expect(second).toMatchObject({ periodId: h.period.id, matchServerId: 1, count: 1 });
    expect(second!.schedule).toBe(first!.schedule);
    expect(JSON.parse(first!.schedule).map((x: { stage: number }) => x.stage)).toEqual([
      2, 3, 4, 5, 6, 7, 8,
    ]);
    h.clock.now = Number(
      expeditionCalendarPhases(h.period).find((row) => row.stage === 7)!.startTime,
    );
    await h.command("army.add", {
      id: sfs.string("107000"),
      num: sfs.int(5),
      gold: sfs.bool(false),
    });
    expect(await h.db.db.select().from(expedition_progress)).toHaveLength(0);
    await h.finish(1);
    expect((await h.db.db.select().from(expedition_progress))[0]).toMatchObject({
      periodId: h.period.id,
      stage: 7,
      score: 25,
    });
    const saved = await h.global.db.select().from(expedition_match_realm);
    h.rules.items.delete("wk_match");
    h.rules.items.delete("wk_match_weight");
    await h.service().refresh();
    await h.realm.apply(h.period, { kingdomId: 1, opponent: 2, matchedAt: BigInt(h.clock.now) });
    expect((await h.db.db.select().from(expedition_period))[0]).toEqual(first);
    expect(await h.global.db.select().from(expedition_match_realm)).toEqual(saved);
  } finally {
    await h.close();
  }
}, 120000);
test("overlapping hero periods delay admission and confirmed statistics cannot change on retry", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.db.db.insert(hero_activity).values({
      uuid: "busy",
      activityId: "9000000",
      activityType: 1,
      startTime: BigInt(h.clock.now - 1),
      endTime: BigInt(h.clock.now + 1000),
      roundTime: 1001n,
      finish: 0,
      alreadyEvent: "",
    });
    await h.service().refresh();
    expect(await h.db.db.select().from(expedition_admission)).toHaveLength(0);
    h.clock.now += 1001;
    await h.service().refresh();
    const [saved] = await h.db.db.select().from(expedition_admission);
    expect(saved).toBeDefined();
    await h.db.db.update(playerinfo).set({ power: 999999999n });
    await h.service().refresh();
    expect((await h.db.db.select().from(expedition_admission))[0]!.statistics).toBe(
      saved!.statistics,
    );
    expect((await h.global.db.select().from(expedition_match_realm))[0]!.statistics).toBe(
      saved!.statistics,
    );
  } finally {
    await h.close();
  }
}, 120000);
test("a realm missing the admission cutoff cannot acquire a fabricated opponent or install a late period", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.service().refresh();
    h.clock.now = Number(h.window.endTime);
    await h.service().refresh();
    await h.service2().refresh();
    expect(
      (await h.global.db.select().from(expedition_match_realm)).map((x) => [
        x.kingdomId,
        x.opponent,
      ]),
    ).toEqual([[1, 0]]);
    expect(await h.db.db.select().from(expedition_period)).toHaveLength(0);
    expect(await h.second.db.select().from(expedition_period)).toHaveLength(0);
    expect((await h.db.db.select().from(expedition_admission))[0]!.appliedAt).toBeGreaterThan(0n);
  } finally {
    await h.close();
  }
}, 120000);
test("failed owned admission and period installation roll back before retry without resampling statistics or opponents", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_expedition_admission() returns trigger language plpgsql as $$ begin raise exception 'synthetic admission rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_expedition_admission before insert on opencok_kingdom.expedition_admission for each row execute function opencok_kingdom.reject_expedition_admission()`,
    );
    await expect(h.service().refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(expedition_admission)).toHaveLength(0);
    expect(await h.global.db.select().from(expedition_match_realm)).toHaveLength(0);
    await h.db.db.execute(
      sql`drop trigger reject_expedition_admission on opencok_kingdom.expedition_admission`,
    );
    await h.service().refresh();
    await h.service2().refresh();
    h.clock.now = Number(h.window.endTime);
    await h.db.db.execute(
      sql`create function opencok_kingdom.reject_expedition_manifest() returns trigger language plpgsql as $$ begin raise exception 'synthetic manifest rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_expedition_manifest before insert on opencok_kingdom.expedition_period for each row execute function opencok_kingdom.reject_expedition_manifest()`,
    );
    await expect(h.service().refresh()).rejects.toThrow();
    const pairs = await h.global.db.select().from(expedition_match_realm);
    expect(pairs.every((x) => x.matchedAt > 0n)).toBe(true);
    expect((await h.db.db.select().from(expedition_admission))[0]!.appliedAt).toBe(0n);
    expect(await h.db.db.select().from(expedition_period)).toHaveLength(0);
    await h.db.db.execute(
      sql`drop trigger reject_expedition_manifest on opencok_kingdom.expedition_period`,
    );
    await h.service().refresh();
    expect((await h.db.db.select().from(expedition_period))[0]!.count).toBe(1);
    expect(await h.global.db.select().from(expedition_match_realm)).toEqual(pairs);
  } finally {
    await h.close();
  }
}, 120000);
test("shared pairing failure preserves frozen registrations and retries the original configuration and seed", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.service().refresh();
    await h.service2().refresh();
    const [batch] = await h.global.db.select().from(expedition_match_batch);
    await h.global.db.execute(
      sql`create function opencok_global.reject_expedition_pair() returns trigger language plpgsql as $$ begin raise exception 'synthetic pair rejection'; end $$`,
    );
    await h.global.db.execute(
      sql`create trigger reject_expedition_pair before update on opencok_global.expedition_match_realm for each row execute function opencok_global.reject_expedition_pair()`,
    );
    h.clock.now = Number(h.window.endTime);
    await expect(h.service().refresh()).rejects.toThrow();
    expect((await h.global.db.select().from(expedition_match_batch))[0]!.matchedAt).toBe(0n);
    expect(
      (await h.global.db.select().from(expedition_match_realm)).every((x) => x.matchedAt === 0n),
    ).toBe(true);
    await h.global.db.execute(
      sql`drop trigger reject_expedition_pair on opencok_global.expedition_match_realm`,
    );
    const changed = { ...expeditionMatchingConfiguration(h.rules), window: 0 };
    await h.registry.finalize(h.period, changed, BigInt(h.clock.now));
    expect(
      (await h.global.db.select().from(expedition_match_realm)).map((x) => x.opponent).sort(),
    ).toEqual([1, 2]);
    expect((await h.global.db.select().from(expedition_match_batch))[0]!.seed).toBe(batch!.seed);
    await h.global.db
      .update(expedition_match_realm)
      .set({ opponent: 0 })
      .where(eq(expedition_match_realm.kingdomId, 2));
    await expect(h.registry.result(h.period, 1)).rejects.toThrow(
      "Invalid reciprocal expedition result",
    );
  } finally {
    await h.close();
  }
}, 120000);
test("a replacement realm authority resumes frozen admission and pending admission blocks new hero calendars", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    await h.service().refresh();
    await h.service2().refresh();
    const probe = async () => {
      let blocked = false;
      await createHeroCalendarStore(h.db.db, h.authority, () => h.clock.now).reconcile((state) => {
        blocked = state.blocked;
        return { activities: [], events: [] };
      });
      return blocked;
    };
    expect(await probe()).toBe(true);
    const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.realm.admit(h.period)).rejects.toThrow();
    h.clock.now = Number(h.window.endTime);
    const realm = createExpeditionMatchingRealmStore(h.db.db, replacement, () => h.clock.now),
      worker = new ExpeditionMatchingService(
        h.calendar,
        realm,
        h.registry,
        h.rules,
        () => h.clock.now,
      );
    await worker.refresh();
    expect((await h.db.db.select().from(expedition_period))[0]).toMatchObject({
      matchServerId: 2,
      count: 1,
    });
    await worker.refresh();
    expect((await h.db.db.select().from(expedition_period))[0]!.count).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("missing optional matching configuration does not reserve a new realm and a shared outage retains its owned statistics", async () => {
  const h = await fixture();
  try {
    h.clock.now = Number(h.window.startTime);
    const config = h.rules.items.get("wk_match")!;
    h.rules.items.delete("wk_match");
    await h.service().refresh();
    expect(await h.db.db.select().from(expedition_admission)).toHaveLength(0);
    expect(await h.global.db.select().from(expedition_match_batch)).toHaveLength(0);
    h.rules.items.set("wk_match", config);
    const worker = new ExpeditionMatchingService(
      h.calendar,
      h.realm,
      {
        ...h.registry,
        register: async () => {
          throw new Error("synthetic shared outage");
        },
      },
      h.rules,
      () => h.clock.now,
    );
    await expect(worker.refresh()).rejects.toThrow("synthetic shared outage");
    const [saved] = await h.db.db.select().from(expedition_admission);
    expect(saved).toBeDefined();
    expect(await h.global.db.select().from(expedition_match_realm)).toHaveLength(0);
    await h.db.db.update(playerinfo).set({ power: 20000000n });
    await h.service().refresh();
    expect((await h.global.db.select().from(expedition_match_realm))[0]!.statistics).toBe(
      saved!.statistics,
    );
  } finally {
    await h.close();
  }
}, 120000);
