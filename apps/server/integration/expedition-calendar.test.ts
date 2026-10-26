import { test, expect } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { loadRules } from "@opencok/resources/rules";
import { ExpeditionCalendarService } from "@opencok/services/expedition-calendar";
import { createExpeditionCalendarStore } from "@opencok/repositories/expedition-calendar";
import { expeditionCalendarPhases } from "@opencok/rules/expedition-calendar";
import { expedition_calendar } from "@opencok/drizzle/schema/opencok_global/expedition_calendar";
import { new_expedition } from "@opencok/drizzle/schema/opencok_global/new_expedition";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
async function fixture() {
  const pg = new DisposablePostgres();
  let db: ReturnType<typeof createDatabase<"global">> | undefined;
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "expedition_calendar_test"');
    await admin.end();
    db = createDatabase("global", { ...pg.options, database: "expedition_calendar_test" });
    await migrate(db.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
        .pathname,
    });
    const rules = await loadRules(),
      clock = { now: Date.UTC(2040, 0, 1) },
      store = createExpeditionCalendarStore(db.db),
      service = () => new ExpeditionCalendarService(store, rules, [1, 2], () => clock.now);
    return {
      db,
      rules,
      clock,
      store,
      service,
      close: async () => {
        await db!.close();
        await pg.stop();
      },
    };
  } catch (error) {
    await db?.close();
    await pg.stop();
    throw error;
  }
}
test("two realm workers share one durable expedition calendar and preserve its schedule after restart", async () => {
  const h = await fixture();
  try {
    const admitted = await Promise.all([h.service().refresh(), h.service().refresh()]);
    expect(admitted[0]).toEqual(admitted[1]);
    expect(await h.db.db.select().from(expedition_calendar)).toHaveLength(1);
    const period = admitted[0]!,
      saved = await h.db.db.select().from(expedition_calendar);
    h.rules.items.delete("17_wk");
    h.clock.now += 1000;
    expect(await h.service().refresh()).toEqual(period);
    expect(await h.db.db.select().from(expedition_calendar)).toEqual(saved);
    h.clock.now = Number(period.startTime) - 1;
    expect(await h.service().refresh()).toBeUndefined();
    expect(await h.db.db.select().from(expedition_calendar)).toEqual(saved);
  } finally {
    await h.close();
  }
}, 120000);
test("calendar rollover is atomic and skips elapsed cycles while a failed insert preserves the prior active row", async () => {
  const h = await fixture();
  try {
    const first = (await h.service().refresh())!;
    h.clock.now = Number(first.endTime) + 10 * 1209600000 + 1;
    await h.db.db.execute(
      sql`create function opencok_global.reject_expedition_calendar() returns trigger language plpgsql as $$ begin raise exception 'synthetic calendar rejection'; end $$`,
    );
    await h.db.db.execute(
      sql`create trigger reject_expedition_calendar before insert on opencok_global.expedition_calendar for each row execute function opencok_global.reject_expedition_calendar()`,
    );
    await expect(h.service().refresh()).rejects.toThrow();
    expect((await h.db.db.select().from(expedition_calendar))[0]!.state).toBe(0);
    await h.db.db.execute(
      sql`drop trigger reject_expedition_calendar on opencok_global.expedition_calendar`,
    );
    const values = await Promise.all([h.service().refresh(), h.service().refresh()]);
    expect(values[0]).toEqual(values[1]);
    expect(values[0]!.cycle).toBe(12);
    const rows = await h.db.db.select().from(expedition_calendar);
    expect(rows).toHaveLength(2);
    expect(rows.filter((x) => x.state === 0)).toHaveLength(1);
    expect(rows.find((x) => x.id === first.id)!.state).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("an imported active stage is adopted without changing legacy rows and ambiguous histories remain untouched", async () => {
  const h = await fixture();
  try {
    const value = {
      uuid: "legacy",
      state: 5,
      startTime: BigInt(h.clock.now - 1000),
      endTime: BigInt(h.clock.now + 3600000),
      count: 8,
    };
    await h.db.db.insert(new_expedition).values(value);
    await h.db.db.insert(new_expedition).values({ ...value, uuid: "ambiguous" });
    await expect(h.service().refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(expedition_calendar)).toHaveLength(0);
    await h.db.db.delete(new_expedition).where(eq(new_expedition.uuid, "ambiguous"));
    const imported = await h.db.db.select().from(new_expedition),
      period = (await h.service().refresh())!;
    expect(expeditionCalendarPhases(period)[0]).toEqual({
      stage: 5,
      startTime: value.startTime,
      endTime: value.endTime,
    });
    expect(period.sourceId).toBe("legacy");
    expect(await h.db.db.select().from(new_expedition)).toEqual(imported);
  } finally {
    await h.close();
  }
}, 120000);
test("disabled flags preserve an active calendar and malformed saved schedules cannot silently reset it", async () => {
  const h = await fixture();
  try {
    const first = (await h.service().refresh())!,
      saved = await h.db.db.select().from(expedition_calendar),
      flag = h.rules.features.get("17_wk")!;
    h.rules.features.set("17_wk", { ...flag, online: "close", test: "close" });
    expect(await h.service().refresh()).toBeUndefined();
    expect(await h.db.db.select().from(expedition_calendar)).toEqual(saved);
    h.rules.features.set("17_wk", flag);
    await h.db.db
      .update(expedition_calendar)
      .set({ schedule: "invalid" })
      .where(eq(expedition_calendar.id, String(first.id)));
    await expect(h.service().refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(expedition_calendar)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
