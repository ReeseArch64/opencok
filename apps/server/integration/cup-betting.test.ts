import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { sfs, Type } from "@opencok/messages/sfs";
import {
  cupBettingDomain,
  CupScheduleService,
  cupSettlementOperation,
} from "@opencok/services/cup-betting";
import { createCupScheduleStore, pendingCupSettlements } from "@opencok/repositories/cup-betting";
import { cupMatches } from "@opencok/rules/cup-betting";
import { soccer_match } from "@opencok/drizzle/schema/opencok_kingdom/soccer_match";
import { user_bet } from "@opencok/drizzle/schema/opencok_kingdom/user_bet";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([cupBettingDomain]);
  try {
    h.clock.now = Date.UTC(2023, 0, 1, 0, 30);
    h.rules.power.activityEvents!.set("9005004", {
      id: "9005004",
      k1: "A;B|C;D",
      k2: "2023-01-01-00-00;2023-01-01-01-00|2023-01-01-00-00;2023-01-01-02-00",
      k3: "2.88;3.33|2.5;1.5",
      k4: "10",
      k5: "3",
      k6: "0;1;2;3",
      k7: "200;200;200;200",
      k8: "246664",
      k9: "2023-01-01-00-00",
      k10: "2023-01-01-03-00",
      k11: "",
    });
    await h.db.db
      .update(user_resource)
      .set({ wood: 1000n, woodbind: 100n, lastUpdateTime: BigInt(h.clock.now) });
    const schedule = new CupScheduleService(
      createCupScheduleStore(h.db.db, h.authority),
      h.rules,
      () => h.clock.now,
    );
    await schedule.refresh();
    const definitions = cupMatches(h.rules),
      first = String(definitions[0]!.id),
      second = String(definitions[1]!.id);
    const bet = (
      amount = 50,
      side = "A",
      owner = "owner",
      id = first,
      operationId = randomUUID(),
      type = 0,
    ) =>
      h.command(
        "euro.cup.bet",
        {
          matchId: sfs.string(id),
          betNum: sfs.string(String(amount)),
          resType: sfs.string(String(type)),
          side: sfs.string(side),
          operationId: sfs.string(operationId),
        },
        owner,
      );
    const result = async (winners = "A|C") => {
      h.rules.power.activityEvents!.get("9005004")!.k11 = winners;
      await schedule.refresh();
    };
    const resource = async (owner = "owner") =>
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, owner)))[0]!;
    const settle = async (owner = "owner") => {
      const pending = (await pendingCupSettlements(h.db.db)).find((row) => row.owner === owner);
      if (!pending) {throw new Error("Missing pending synthetic bets");}
      return h.command(
        "euro.cup.settle",
        { operationId: sfs.string(cupSettlementOperation(owner, pending.ids)) },
        owner,
      );
    };
    return { ...h, first, second, bet, result, resource, settle, schedule };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("cup bets atomically consume bound resources, freeze float odds and retain a repeated order's grant", async () => {
  const h = await fixture();
  try {
    const operation = randomUUID(),
      placed = await h.bet(50, "a", "owner", h.first, operation);
    await h.bet(50, "a", "owner", h.first, operation);
    expect(placed.body.odds).toEqual({ type: Type.Float, value: Math.fround(2.88) });
    expect(await h.resource()).toMatchObject({ wood: 1000n, woodbind: 50n });
    expect(await h.db.db.select().from(user_bet)).toHaveLength(1);
    const afterFirst = (await h.db.db.select().from(soccer_match)).find(
      (row) => row.id === h.first,
    )!;
    expect(Math.fround(afterFirst.oddsB!)).toBe(Math.fround(3.33));
    await h.bet(100, "B", "other");
    const afterBoth = (await h.db.db.select().from(soccer_match)).find(
      (row) => row.id === h.first,
    )!;
    expect(afterBoth).toMatchObject({ betNumA: 50n, betNumB: 100n, oddsA: 3, oddsB: 1.5 });
    await h.bet(10, "A");
    expect(
      (await h.db.db.select().from(user_bet))
        .filter((row) => row.uid === "owner")
        .map((row) => Math.fround(row.odds!))
        .sort(),
    ).toEqual([Math.fround(2.88), 3]);
    const changed = (await h.db.db.select().from(soccer_match)).find((row) => row.id === h.first)!;
    expect(Math.fround(changed.oddsA!)).toBe(Math.fround(Math.fround(160) / Math.fround(60)));
    expect(await h.db.db.select().from(user_item)).not.toHaveLength(0);
    const history = (await h.command("euro.cup.record", {})).body;
    expect(history.betList?.type).toBe(Type.Array);
  } finally {
    await h.close();
  }
}, 120000);
test("cup admission rejects invalid stakes, mixed resources, limits and late bets without modifying inventory or pools", async () => {
  const h = await fixture();
  try {
    for (const amount of [0, -1, 201]) {await expect(h.bet(amount)).rejects.toThrow();}
    await expect(h.bet(10, "unknown")).rejects.toThrow();
    expect(await h.db.db.select().from(user_bet)).toHaveLength(0);
    await h.bet(70);
    await expect(h.bet(10, "A", "owner", h.first, randomUUID(), 1)).rejects.toThrow();
    await h.bet(70);
    await expect(h.bet(61)).rejects.toThrow();
    await h.bet(60);
    await expect(h.bet(1)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_bet)).filter((row) => row.uid === "owner"),
    ).toHaveLength(3);
    h.clock.now = Date.UTC(2023, 0, 1, 1);
    await expect(h.bet(1, "A", "other")).rejects.toThrow();
    expect(
      (await h.db.db.select().from(soccer_match)).find((row) => row.id === h.first)!.betNumA,
    ).toBe(200n);
  } finally {
    await h.close();
  }
}, 120000);
test("trusted cup results cannot settle early and concurrent claims credit only the original winning odds", async () => {
  const h = await fixture();
  try {
    await h.bet(50);
    await h.bet(50, "B", "other");
    await h.result();
    expect(
      (await h.db.db.select().from(soccer_match)).find((row) => row.id === h.first)!.ended,
    ).toBe(0);
    expect((await h.command("euro.cup.reward", {})).body.reward).toEqual(sfs.array([]));
    h.clock.now = Date.UTC(2023, 0, 1, 1, 1);
    await h.result();
    const before = await h.resource();
    await Promise.all([h.command("euro.cup.reward", {}), h.command("euro.cup.reward", {})]);
    expect((await h.resource()).woodbind - before.woodbind!).toBe(144n);
    await h.command("euro.cup.reward", {}, "other");
    expect((await h.db.db.select().from(user_bet)).every((row) => row.rewarded === 1)).toBe(true);
    expect(await pendingCupSettlements(h.db.db)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("cup receipt failure rolls back a wager, its debit, pool change and participation reward", async () => {
  const h = await fixture();
  try {
    const before = await h.resource();
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_cup_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_cup_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_cup_receipt()`,
    );
    await expect(h.bet()).rejects.toThrow();
    expect(await h.resource()).toEqual(before);
    expect(await h.db.db.select().from(user_bet)).toHaveLength(0);
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(soccer_match)).find((row) => row.id === h.first)!.betNumA,
    ).toBe(0n);
  } finally {
    await h.close();
  }
}, 120000);
test("expired cup rounds fund mail once and later results for a different match receive an independent settlement identity", async () => {
  const h = await fixture();
  try {
    await h.bet(50);
    await h.bet(20, "C", "owner", h.second);
    h.clock.now = Date.UTC(2023, 0, 1, 4);
    await h.result("A|");
    const first = (await pendingCupSettlements(h.db.db))[0]!;
    await h.settle();
    await h.command("euro.cup.settle", {
      operationId: sfs.string(cupSettlementOperation("owner", first.ids)),
    });
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
    expect(await pendingCupSettlements(h.db.db)).toHaveLength(0);
    await h.result("A|C");
    const second = (await pendingCupSettlements(h.db.db))[0]!;
    expect(cupSettlementOperation("owner", second.ids)).not.toBe(
      cupSettlementOperation("owner", first.ids),
    );
    await h.settle();
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
    expect((await h.command("euro.cup.info", {})).body.matchList).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("concurrent cup buyers preserve both owned debits and the shared match pool", async () => {
  const h = await fixture();
  try {
    await Promise.all([h.bet(50, "A"), h.bet(50, "B", "other")]);
    const match = (await h.db.db.select().from(soccer_match)).find((row) => row.id === h.first)!;
    expect(match).toMatchObject({ betNumA: 50n, betNumB: 50n, oddsA: 2, oddsB: 2 });
    expect(await h.resource()).toMatchObject({ wood: 1000n, woodbind: 50n });
    expect(await h.resource("other")).toMatchObject({ wood: 1000n, woodbind: 50n });
    expect(await h.db.db.select().from(user_bet)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("expired cup settlement bounds each player's mail batch and resumes the remaining winning bets", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(user_bet).values(
      Array.from({ length: 65 }, (_, index) => ({
        uuid: `legacy-${String(index).padStart(3, "0")}`,
        uid: "owner",
        matchId: h.first,
        vs: "A|B",
        resourceType: 0,
        betNum: 1,
        betSide: "A",
        winner: "",
        ended: 0,
        rewarded: 0,
        odds: 2.88,
      })),
    );
    h.clock.now = Date.UTC(2023, 0, 1, 4);
    await h.result();
    const [first] = await pendingCupSettlements(h.db.db);
    expect(first!.ids).toHaveLength(64);
    await h.settle();
    expect(await h.db.db.select().from(mail)).toHaveLength(64);
    const [next] = await pendingCupSettlements(h.db.db);
    expect(next!.ids).toHaveLength(1);
    await h.settle();
    expect(await h.db.db.select().from(mail)).toHaveLength(65);
    expect(await pendingCupSettlements(h.db.db)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
