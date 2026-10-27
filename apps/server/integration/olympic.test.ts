import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { sfs, Type } from "@opencok/messages/sfs";
import {
  olympicDomain,
  OlympicScheduleService,
  olympicSettlementOperation,
} from "@opencok/services/olympic";
import {
  createOlympicScheduleStore,
  pendingOlympicSettlements,
} from "@opencok/repositories/olympic";
import { question_match } from "@opencok/drizzle/schema/opencok_kingdom/question_match";
import { user_olympic_bet } from "@opencok/drizzle/schema/opencok_kingdom/user_olympic_bet";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([olympicDomain]);
  try {
    h.clock.now = Date.UTC(2023, 0, 1, 0, 30);
    h.rules.power.activityPanels!.set("57092", {
      id: "57092",
      function_on: "1",
      start: "2023-01-01-00-00",
      end: "2023-01-01-03-00",
    });
    h.rules.advanced.olympicBets!.clear();
    for (const [id, type, end] of [
      ["wood", 0, "2023-01-01-01-00"],
      ["gold", 5, "2023-01-01-02-00"],
    ] as const)
      h.rules.advanced.olympicBets!.set(id, {
        id,
        type: String(type),
        start: "2023-01-01-00-00",
        end,
        basic: "10000",
        limit: "10000",
        limit1: "1000",
        rate: "100",
        cheat: "1000",
        earn_ratio: "10",
      });
    await h.db.db
      .update(user_resource)
      .set({ wood: 1000n, woodbind: 1000n, lastUpdateTime: BigInt(h.clock.now) });
    const schedule = new OlympicScheduleService(
      createOlympicScheduleStore(h.db.db, h.authority),
      h.rules,
      () => h.clock.now,
    );
    await schedule.refresh();
    const bet = (
      count = 100,
      answer = "JP",
      owner = "owner",
      id = "wood",
      type = 0,
      operationId = randomUUID(),
    ) =>
      h.command(
        "Olympic.bet",
        {
          questionId: sfs.string(id),
          betNum: sfs.int(count),
          resType: sfs.int(type),
          answer: sfs.string(answer),
          operationId: sfs.string(operationId),
        },
        owner,
      );
    const result = async (id = "wood", answer = "JP") => {
      h.rules.advanced.olympicBets!.get(id)!.result = answer;
      await schedule.refresh();
    };
    const resource = async (owner = "owner") =>
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, owner)))[0]!;
    const profile = async (owner = "owner") =>
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!;
    const settle = async (owner = "owner") => {
      const pending = (await pendingOlympicSettlements(h.db.db)).find((row) => row.owner === owner);
      if (!pending) throw new Error("Missing synthetic Olympic settlement");
      return h.command(
        "Olympic.settle",
        { operationId: sfs.string(olympicSettlementOperation(owner, pending.ids)) },
        owner,
      );
    };
    return { ...h, schedule, bet, result, resource, profile, settle };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("Olympic stakes consume owned bound resources once and share a conserved pool under concurrent buyers", async () => {
  const h = await fixture();
  try {
    const operation = randomUUID();
    await h.bet(100, "JP", "owner", "wood", 0, operation);
    await h.bet(100, "JP", "owner", "wood", 0, operation);
    await Promise.all([h.bet(50, "DE", "other"), h.bet(50, "JP", "owner")]);
    expect(await h.resource()).toMatchObject({ wood: 1000n, woodbind: 850n });
    expect(await h.resource("other")).toMatchObject({ wood: 1000n, woodbind: 950n });
    expect(await h.db.db.select().from(user_olympic_bet)).toHaveLength(3);
    expect(
      (await h.db.db.select().from(question_match)).find((row) => row.id === "wood")!.betNum,
    ).toBe(200n);
    const list = (await h.command("Olympic.question.info", {})).body.matchList;
    expect(list?.type).toBe(Type.Array);
    const history = (await h.command("Olympic.bet.info", {})).body.betList;
    expect(history?.value).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("Olympic admission enforces resource type, positive stake, cap and cutoff without accepting client outcomes", async () => {
  const h = await fixture();
  try {
    for (const count of [0, -1, 1001]) await expect(h.bet(count)).rejects.toThrow();
    await expect(h.bet(1, "JP", "owner", "wood", 5)).rejects.toThrow();
    await expect(h.bet(1, "")).rejects.toThrow();
    expect(await h.db.db.select().from(user_olympic_bet)).toHaveLength(0);
    await h.result();
    expect(
      (await h.db.db.select().from(question_match)).find((row) => row.id === "wood")!.ended,
    ).toBe(0);
    h.clock.now = Date.UTC(2023, 0, 1, 1);
    await expect(h.bet()).rejects.toThrow();
    h.rules.power.activityPanels!.get("57092")!.function_on = "0";
    await expect(h.bet(1, "BR", "owner", "gold", 5)).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("Olympic finality freezes winner stake, losing pool and tax before repeatable owned claims", async () => {
  const h = await fixture();
  try {
    await h.bet(100, "JP");
    await h.bet(100, "JP", "other");
    await h.bet(100, "DE", "other");
    h.clock.now = Date.UTC(2023, 0, 1, 1, 1);
    await h.result();
    const question = (await h.db.db.select().from(question_match)).find(
      (row) => row.id === "wood",
    )!;
    expect(question).toMatchObject({
      ended: 1,
      result: "JP",
      winningBetNum: 200n,
      rewardPool: 100n,
      tax: 10,
    });
    h.rules.advanced.olympicBets!.get("wood")!.earn_ratio = "50";
    h.rules.advanced.olympicBets!.get("wood")!.basic = "9000000";
    const before = await h.resource();
    await Promise.all([h.command("Olympic.reward", {}), h.command("Olympic.reward", {})]);
    expect((await h.resource()).woodbind! - before.woodbind!).toBe(146n);
    await h.command("Olympic.reward", {}, "other");
    expect((await h.resource("other")).woodbind).toBe(946n);
    expect((await h.db.db.select().from(user_olympic_bet)).every((row) => row.rewarded === 1)).toBe(
      true,
    );
  } finally {
    await h.close();
  }
}, 120000);
test("gold questions debit all owned gold pools and credit the configured basic-pool fallback only once", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .update(userprofile)
      .set({ gold: 10n, paidGold: 20n, paidSpecialGold: 0n })
      .where(eq(userprofile.uid, "owner"));
    const placed = await h.bet(20, "BR", "owner", "gold", 5);
    expect(placed.body.gold).toEqual(sfs.long(10n));
    expect(await h.profile()).toMatchObject({ gold: 0n, paidGold: 10n });
    h.clock.now = Date.UTC(2023, 0, 1, 2, 1);
    await h.result("gold", "BR");
    await h.command("Olympic.reward", {});
    await h.command("Olympic.reward", {});
    expect(await h.profile()).toMatchObject({ gold: 921n, paidGold: 10n });
  } finally {
    await h.close();
  }
}, 120000);
test("a failed Olympic receipt restores the stake and pool and cannot leave an orphaned wager", async () => {
  const h = await fixture();
  try {
    const before = await h.resource();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_olympic_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_olympic_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_olympic_receipt()`,
    );
    await expect(h.bet()).rejects.toThrow();
    expect(await h.resource()).toEqual(before);
    expect(await h.db.db.select().from(user_olympic_bet)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(question_match)).find((row) => row.id === "wood")!.betNum,
    ).toBe(0n);
  } finally {
    await h.close();
  }
}, 120000);
test("late Olympic results fund the exact owned wager batch after expiry and leave other unresolved questions pending", async () => {
  const h = await fixture();
  try {
    await h.bet(100);
    await h.bet(10, "BR", "owner", "gold", 5);
    h.clock.now = Date.UTC(2023, 0, 1, 4);
    await h.result();
    const first = (await pendingOlympicSettlements(h.db.db))[0]!;
    await h.settle();
    await h.command("Olympic.settle", {
      operationId: sfs.string(olympicSettlementOperation("owner", first.ids)),
    });
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
    expect(await pendingOlympicSettlements(h.db.db)).toHaveLength(0);
    await h.result("gold", "BR");
    await h.settle();
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
    expect((await h.db.db.select().from(user_olympic_bet)).every((row) => row.rewarded === 1)).toBe(
      true,
    );
  } finally {
    await h.close();
  }
}, 120000);
test("legacy closed Olympic questions retain their saved reward without inventing a new pool", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(question_match).values({
      id: "legacy",
      result: "BR",
      startBetTime: 1n,
      startTime: 2n,
      ended: 1,
      betNum: 10n,
    });
    await h.db.db.insert(user_olympic_bet).values({
      uuid: "legacy-bet",
      uid: "owner",
      questionId: "legacy",
      resourceType: 0,
      betNum: 10,
      betCountry: "BR",
      result: "BR",
      ended: 1,
      rewarded: 0,
      reward: 27,
    });
    const before = await h.resource();
    await h.command("Olympic.reward", {});
    expect((await h.resource()).woodbind! - before.woodbind!).toBe(27n);
    const question = (await h.db.db.select().from(question_match)).find(
      (row) => row.id === "legacy",
    )!;
    expect(question.winningBetNum).toBeNull();
    expect(question.rewardPool).toBeNull();
  } finally {
    await h.close();
  }
}, 120000);
test("Olympic reward receipt failure rolls back the credit and collected flag before a successful retry", async () => {
  const h = await fixture();
  try {
    await h.bet(100);
    h.clock.now = Date.UTC(2023, 0, 1, 1, 1);
    await h.result();
    const before = await h.resource();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_olympic_claim() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_olympic_claim BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_olympic_claim()`,
    );
    await expect(h.command("Olympic.reward", {})).rejects.toThrow();
    expect(await h.resource()).toEqual(before);
    expect((await h.db.db.select().from(user_olympic_bet))[0]!.rewarded).toBe(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_olympic_claim ON opencok_kingdom.command_receipt`,
    );
    await h.command("Olympic.reward", {});
    expect((await h.resource()).woodbind! - before.woodbind!).toBe(1001n);
  } finally {
    await h.close();
  }
}, 120000);
