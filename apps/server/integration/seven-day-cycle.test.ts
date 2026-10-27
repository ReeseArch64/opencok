import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
  createSevenDayCycleDomain,
  sevenDayPurchaseOperationId,
} from "@opencok/services/seven-day-cycle";
import { user_exchange_cycle } from "@opencok/drizzle/schema/opencok_kingdom/user_exchange_cycle";
import { user_luck_draw } from "@opencok/drizzle/schema/opencok_kingdom/user_luck_draw";
import { luck_draw_history } from "@opencok/drizzle/schema/opencok_kingdom/luck_draw_history";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  let accepted = 0;
  const h = await cityHarness([
    createSevenDayCycleDomain(
      {
        accept: async (input) => {
          accepted++;
          return input.owner === "owner" && input.eventId.startsWith("approved");
        },
      },
      () => 0,
    ),
  ]);
  h.clock.now = Date.UTC(2026, 9, 25, 12);
  h.rules.advanced.exchangeCycles!.clear();
  for (let page = 0; page < 3; page++)
    {for (let stage = 1; stage <= 7; stage++) {
      const id = String(99100000 + page * 100 + stage);
      h.rules.advanced.exchangeCycles!.set(id, {
        id,
        page: String(page),
        stage: String(stage),
        level: "1;50",
        exchangeid: `88000${stage}`,
        hot: "0",
        time: "0",
        reward: stage % 2 === 0 ? "990001" : "0",
      });
    }}
  h.rules.reconnect.rewards!.set("990001", { id: "990001", gold: "7" });
  h.rules.features.set("luck_draw", {
    id: "luck_draw",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  h.rules.configuration.payControl!.set("69033", { id: "69033", k3: "0;1;2" });
  h.rules.advanced.cycleDraws!.clear();
  h.rules.advanced.cycleDraws!.set("990010", {
    id: "990010",
    type: "0",
    rate: "1",
    reward: "990001",
    color: "4",
  });
  const saved = async () =>
    (
      await h.db.db.select().from(user_exchange_cycle).where(eq(user_exchange_cycle.uid, "owner"))
    )[0]!;
  const draw = async () =>
    (await h.db.db.select().from(user_luck_draw).where(eq(user_luck_draw.uid, "owner")))[0];
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  const purchase = (stage: number, eventId: string) =>
    h.command("sevenday.purchase", {
      page: sfs.int(0),
      exchangeId: sfs.string(`88000${stage}`),
      eventId: sfs.string(eventId),
      operationId: sfs.string(sevenDayPurchaseOperationId("owner", eventId)),
    });
  return { ...h, saved, draw, gold, purchase, accepted: () => accepted };
}
test("verified cycle purchases require canonical durable receipts and advance only one eligible daily stage", async () => {
  const h = await fixture();
  try {
    await h.command("sevenday.init", {});
    const info = await h.command("sevenday.info", { page: sfs.int(0) });
    expect(info.body.curstage).toEqual(sfs.int(0));
    expect(info.body.datas!.value as Value[]).toHaveLength(7);
    expect(fields((info.body.datas!.value as Value[])[0]).dollar).toEqual(sfs.double(0.99));
    await Promise.all(Array.from({ length: 4 }, () => h.purchase(1, "approved-first")));
    expect(h.accepted()).toBe(1);
    expect((await h.saved()).stage).toBe(1);
    expect((await h.draw())!.count).toBe(1);
    expect((await h.command("sevenday.info", { page: sfs.int(0) })).body.countdown).toEqual(
      sfs.int(43200),
    );
    await expect(h.purchase(2, "approved-same-day")).rejects.toThrow();
    h.clock.now += 86400000;
    await h.purchase(1, "approved-first");
    expect((await h.saved()).stage).toBe(1);
    await expect(
      h.command("sevenday.purchase", {
        page: sfs.int(0),
        exchangeId: sfs.string("880002"),
        eventId: sfs.string("approved-first"),
        operationId: sfs.string(randomUUID()),
      }),
    ).rejects.toThrow();
    await expect(h.purchase(3, "approved-skip")).rejects.toThrow();
    await h.purchase(2, "approved-second");
    expect((await h.saved()).stage).toBe(2);
    expect((await h.saved()).totalstage).toBe(2);
    expect((await h.draw())!.count).toBe(2);
    const baseline = await h.gold(),
      params = {
        page: sfs.int(0),
        id: sfs.string("99100002"),
        operationId: sfs.string(randomUUID()),
      };
    await Promise.all(Array.from({ length: 4 }, () => h.command("sevenday.reward", params)));
    expect(await h.gold()).toBe(baseline + 7n);
    await h.command("sevenday.reward", { page: sfs.int(0), id: sfs.string("99100002") });
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.saved()).receive_reward).toBe("99100002;");
  } finally {
    await h.close();
  }
}, 120000);
test("cycle claims validate page, ownership, exact tokens and saved reset deadlines", async () => {
  const h = await fixture();
  try {
    await h.command("sevenday.init", {});
    await h.db.db
      .update(user_exchange_cycle)
      .set({
        stage: 2,
        stage1: 2,
        receive_reward: "199100002;",
        cdtime: BigInt(h.clock.now + 1000),
      })
      .where(eq(user_exchange_cycle.uid, "owner"));
    const baseline = await h.gold();
    await h.command("sevenday.reward", { page: sfs.int(0), id: sfs.string("99100002") });
    expect(await h.gold()).toBe(baseline + 7n);
    await expect(
      h.command("sevenday.reward", { page: sfs.int(1), id: sfs.string("99100002") }),
    ).rejects.toThrow();
    await h.command("sevenday.reward", { page: sfs.int(1), id: sfs.string("99100102") });
    expect(await h.gold()).toBe(baseline + 14n);
    const preview = await h.command("sevenday.look.reward", { id: sfs.string("99100004") });
    expect(preview.body.reward_arr!.value as Value[]).toHaveLength(1);
    expect(await h.gold()).toBe(baseline + 14n);
    h.clock.now += 1000;
    const reset = await h.command("sevenday.info", { page: sfs.int(0) });
    expect(reset.body.curstage).toEqual(sfs.int(0));
    expect(reset.body.resettime).toEqual(sfs.int(-1));
    expect((await h.saved()).cdtime).toBe(-1n);
    expect((await h.saved()).stage1).toBe(2);
    await expect(h.command("sevenday.info", { page: sfs.int(3) })).rejects.toThrow();
    expect(
      await h.db.db.select().from(user_exchange_cycle).where(eq(user_exchange_cycle.uid, "other")),
    ).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("cycle draws persist rare history and status deadlines without creating draw credits on login", async () => {
  const h = await fixture();
  try {
    await h.command("sevenday.info", { page: sfs.int(0) });
    expect((await h.draw())!.count).toBe(0);
    await expect(h.command("sevenday.lucky.draw", { page: sfs.int(0) })).rejects.toThrow();
    await h.db.db.update(user_luck_draw).set({ count: 2 }).where(eq(user_luck_draw.uid, "owner"));
    const baseline = await h.gold(),
      params = { page: sfs.int(0), operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("sevenday.lucky.draw", params)));
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.draw())!.count).toBe(1);
    expect(await h.db.db.select().from(luck_draw_history)).toHaveLength(1);
    h.rules.advanced.cycleDraws!.set("990010", {
      id: "990010",
      type: "0",
      rate: "1",
      buff: "505574",
      color: "4",
    });
    h.rules.power.statuses!.set("505574", {
      ...h.rules.power.statuses!.get("505574")!,
      time: "60",
      effect: "50;100",
    });
    const buff = await h.command("sevenday.lucky.draw", { page: sfs.int(0) });
    expect(fields(buff.body.buff).endTime).toEqual(sfs.long(BigInt(h.clock.now + 60000)));
    expect(buff.pushes.some((push) => push.command === "status.push")).toBe(true);
    expect((await h.draw())!.count).toBe(0);
    expect((await h.draw())!.reward).toBe(`505574:${h.clock.now + 60000}`);
    expect(await h.db.db.select().from(user_state).where(eq(user_state.uid, "owner"))).toHaveLength(
      1,
    );
    const info = await h.command("sevenday.info", { page: sfs.int(0) });
    expect(fields((info.body.luckdrawcofig!.value as Value[])[0]).endTime).toEqual(
      sfs.long(BigInt(h.clock.now + 60000)),
    );
    expect(info.body.drawhistory!.value as Value[]).toHaveLength(2);
    h.clock.now += 60000;
    expect(
      fields(
        (
          (await h.command("sevenday.info", { page: sfs.int(0) })).body.luckdrawcofig!
            .value as Value[]
        )[0],
      ).endTime,
    ).toEqual(sfs.long(0n));
  } finally {
    await h.close();
  }
}, 120000);
test("unverified cycle purchases and database failures cannot partially advance, grant or consume a draw", async () => {
  const h = await fixture();
  try {
    await expect(h.purchase(1, "rejected-event")).rejects.toThrow();
    expect(await h.db.db.select().from(user_exchange_cycle)).toHaveLength(0);
    await h.purchase(1, "approved-first");
    const baseline = await h.gold();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_cycle_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_cycle_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_cycle_receipt()`,
    );
    await expect(h.command("sevenday.lucky.draw", { page: sfs.int(0) })).rejects.toThrow();
    expect(await h.gold()).toBe(baseline);
    expect((await h.draw())!.count).toBe(1);
    expect(await h.db.db.select().from(luck_draw_history)).toHaveLength(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_cycle_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("sevenday.lucky.draw", { page: sfs.int(0) });
    expect(await h.gold()).toBe(baseline + 7n);
    expect((await h.draw())!.count).toBe(0);
    h.rules.features.get("luck_draw")!.online = "close";
    expect((await h.command("sevenday.lucky.draw", { page: sfs.int(0) })).body.id).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
