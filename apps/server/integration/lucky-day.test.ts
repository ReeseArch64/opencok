import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createLuckyDayDomain } from "@opencok/services/lucky-day";
import { lucky_day } from "@opencok/drizzle/schema/opencok_kingdom/lucky_day";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { decodeProductionRates } from "@opencok/mappings/production";
import { sfs, fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture(failure = false) {
  const h = await cityHarness([createLuckyDayDomain((maximum) => (failure ? maximum - 1 : 0))]);
  h.clock.now = Date.UTC(2026, 9, 25, 12);
  h.rules.features.set("luckyday_server", {
    id: "luckyday_server",
    version: "1.0.0",
    online: "all",
    test: "all",
  });
  h.rules.configuration.payControl!.set("69028", {
    id: "69028",
    k1: "1.0.0",
    k2: "all",
    k3: "all",
    k4: "1",
    k72: "1",
    k107: "1",
  });
  h.rules.power.activityPanels!.set("57091", {
    id: "57091",
    function_on: "1",
    start: "2026-10-25-00-00",
    end: "2026-10-30-00-00",
    para1: "990001",
  });
  h.rules.advanced.luckyDays!.set("990001", {
    id: "990001",
    times_24hr: "2",
    open_level: "1",
    open_rate: failure ? "0" : "100",
    rnd_times: "2",
    open_time: "1",
    life_time: "1",
    effect: "990010",
    effect_rate: "100",
  });
  h.rules.power.luckyEffects!.set("990010", { id: "990010", effect: "50;100" });
  await h.db.db
    .insert(server_info)
    .values({ uid: "server", activityTime: 0n, lastMergeMillis: 0n });
  const saved = async () =>
    (await h.db.db.select().from(lucky_day).where(eq(lucky_day.uid, "owner")))[0]!;
  const roll = (operationId = sfs.string(randomUUID())) =>
    h.command("luckyday.effect", { operationId });
  return { ...h, saved, roll };
}
test("lucky draws persist once, respect active deadlines and daily limits and recover their native login state", async () => {
  const h = await fixture();
  try {
    const initial = await h.command("luckyday.init", {});
    expect(fields(initial.body.luckyday).lucky_id).toEqual(sfs.string("-1"));
    const operationId = sfs.string(randomUUID());
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.roll(operationId)));
    expect(replies.every((reply) => reply.body.luckyeffectId!.value === "990010")).toBe(true);
    expect((await h.saved()).luckyCount).toBe(1);
    const deadline = (await h.saved()).time!;
    const login = await h.command("luckyday.init", {});
    expect(fields(login.body.luckyday).effectEndTime).toEqual(sfs.long(deadline));
    await h.roll();
    expect((await h.saved()).time).toBe(deadline);
    expect((await h.saved()).luckyCount).toBe(1);
    h.clock.now = Number(deadline);
    await h.roll();
    expect((await h.saved()).luckyCount).toBe(2);
    h.clock.now = Number((await h.saved()).time);
    await h.roll();
    expect((await h.saved()).luckyCount).toBe(2);
    h.clock.now += 86400000;
    await h.roll();
    expect((await h.saved()).luckyCount).toBe(1);
    expect(
      (await h.db.db.select().from(economy_posting)).filter(
        (row) => row.asset === "profile.gold" || row.asset.startsWith("item."),
      ),
    ).toEqual([]);
  } finally {
    await h.close();
  }
}, 120000);
test("unlucky attempts retain their cooldown and guarantee threshold under retries", async () => {
  const h = await fixture(true);
  try {
    const id = sfs.string(randomUUID());
    const failures = await Promise.all(Array.from({ length: 4 }, () => h.roll(id)));
    expect(failures.every((row) => row.body.luckyeffectId!.value === "-1")).toBe(true);
    expect((await h.saved()).unluckyCount).toBe(1);
    await h.roll();
    expect((await h.saved()).unluckyCount).toBe(1);
    h.clock.now += 60000;
    await h.roll();
    expect((await h.saved()).unluckyCount).toBe(2);
    h.clock.now += 60000;
    const guaranteed = await h.roll();
    expect(guaranteed.body.luckyeffectId).toEqual(sfs.string("990010"));
    expect((await h.saved()).unluckyCount).toBe(0);
    expect((await h.saved()).luckyCount).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("lucky production bonuses settle at activation and expiry without applying retrospectively", async () => {
  const h = await fixture();
  try {
    const rates = async () =>
      decodeProductionRates(
        (
          await h.db.db
            .select()
            .from(building_production)
            .where(eq(building_production.buildingId, "owner-413000"))
        )[0]!.rates,
      );
    await h.production.command("owner", "production.settle", {});
    const baseline = (await rates()).at(-1)!.perHour;
    await h.roll();
    const boosted = await rates(),
      deadline = (await h.saved()).time!;
    expect(boosted.find((rate) => rate.at === BigInt(h.clock.now))!.perHour).toBe(baseline * 2n);
    expect(boosted.find((rate) => rate.at === deadline)!.perHour).toBe(baseline);
    h.clock.now = Number((await h.saved()).time) + 1000;
    await h.production.command("owner", "production.settle", {});
    const expired = await rates();
    expect(expired.at(-1)!.perHour).toBe(baseline);
  } finally {
    await h.close();
  }
}, 120000);
test("lucky campaigns honor platform controls, historical windows and exact merge-window boundaries", async () => {
  const h = await fixture();
  try {
    h.rules.configuration.payControl!.get("69028")!.k3 = "unavailable";
    await h.roll();
    expect((await h.db.db.select().from(lucky_day)).length).toBe(0);
    h.rules.configuration.payControl!.get("69028")!.k3 = "all";
    h.rules.power.activityPanels!.get("57091")!.function_on = "0";
    const merged = BigInt(h.clock.now) - 30000n;
    await h.db.db
      .update(server_info)
      .set({ lastMergeMillis: merged })
      .where(eq(server_info.uid, "server"));
    h.rules.power.mergeActivities!.clear();
    h.rules.power.mergeActivities!.set("synthetic", {
      id: "synthetic",
      activityId: "57091",
      merge_start: "0",
      merge_end: "1",
      para1: "990001",
    });
    await h.roll();
    expect((await h.saved()).status).toBe(1);
    h.clock.now = Number(merged) + 60000;
    const prior = await h.saved();
    await h.roll();
    expect(await h.saved()).toEqual(prior);
  } finally {
    await h.close();
  }
}, 120000);
