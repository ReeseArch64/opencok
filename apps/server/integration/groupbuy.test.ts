import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { createGroupBuyDomain, groupBuyOperation } from "@opencok/services/groupbuy";
import { groupBuyId, groupBuyPeriod, groupBuyRounds } from "@opencok/rules/groupbuy";
import { pendingGroupBuys } from "@opencok/repositories/groupbuy";
import { alliance_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/alliance_group_buys";
import { activity_group_buys } from "@opencok/drizzle/schema/opencok_kingdom/activity_group_buys";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import type { GroupBuyGateway } from "@opencok/contracts/groupbuy";
import { cityHarness } from "./support/city";
async function fixture(bound = true) {
  const proofs = new Map<
      string,
      { owner: string; proof: NonNullable<Awaited<ReturnType<GroupBuyGateway["accepted"]>>> }
    >(),
    cancelled = new Set<string>(),
    totals = new Map<number, number>();
  const gateway: GroupBuyGateway = {
    async accepted({ owner, eventId }) {
      const row = proofs.get(eventId);
      return row?.owner === owner ? row.proof : null;
    },
    async cancelled({ owner, eventId }) {
      return cancelled.has(`${owner}:${eventId}`);
    },
    async reconciled({ round }) {
      const total = totals.get(round);
      return total === undefined ? null : { totalPoints: total };
    },
  };
  const h = await cityHarness([createGroupBuyDomain(bound ? gateway : undefined)]);
  try {
    h.clock.now = Date.UTC(2023, 0, 1, 12);
    h.rules.features.set("alliance_groupbuys", {
      id: "alliance_groupbuys",
      version: "1",
      online: "all",
      test: "all",
    });
    h.rules.power.activityPanels!.set("57133", {
      ...h.rules.power.activityPanels!.get("57133")!,
      start: "2023-01-01-00-00",
      end: "2023-01-03-00-00",
    });
    await h.db.db
      .insert(server_info)
      .values({ uid: "server", activityTime: BigInt(h.clock.now - 31 * 86400000) });
    await h.db.db.update(user_building).set({ level: 15 }).where(eq(user_building.itemId, 400000));
    const period = groupBuyPeriod(h.rules)!,
      id = groupBuyId(period);
    const reserve = (eventId = randomUUID(), owner = "owner", exchangeId = "759047") =>
      h.command(
        "groupbuys.reserve",
        {
          eventId: sfs.string(eventId),
          exchangeId: sfs.string(exchangeId),
          operationId: sfs.string(groupBuyOperation("reserve", eventId)),
        },
        owner,
      );
    const pay = (eventId: string, owner = "owner") =>
      h.command(
        "groupbuys.paid",
        {
          eventId: sfs.string(eventId),
          operationId: sfs.string(groupBuyOperation("paid", eventId)),
        },
        owner,
      );
    const prove = (eventId: string, owner = "owner", exchangeId = "759047", round = 1) =>
      proofs.set(eventId, {
        owner,
        proof: { activityId: id, round, exchangeId, occurredAt: BigInt(h.clock.now) },
      });
    const close = (round = 1) =>
      h.command("groupbuys.close", {
        activityId: sfs.string(id),
        round: sfs.int(round),
        operationId: sfs.string(groupBuyOperation("close", `${id}:${round}`)),
      });
    const settle = (owner = "owner", round = 1) =>
      h.command(
        "groupbuys.settle",
        {
          activityId: sfs.string(id),
          round: sfs.int(round),
          operationId: sfs.string(groupBuyOperation("settle", `${owner}:${id}:${round}`)),
        },
        owner,
      );
    const cancel = (eventId: string, owner = "owner") =>
      h.command(
        "groupbuys.cancel",
        {
          activityId: sfs.string(id),
          round: sfs.int(1),
          eventId: sfs.string(eventId),
          operationId: sfs.string(groupBuyOperation("cancel", eventId)),
        },
        owner,
      );
    return {
      ...h,
      id,
      period,
      reserve,
      pay,
      prove,
      closeRound: close,
      settle,
      cancel,
      cancelled,
      totals,
      proofs,
    };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("group buys reserve a shared round point limit before payment and bind every contribution to its owned order", async () => {
  const h = await fixture();
  try {
    const events = [randomUUID(), randomUUID(), randomUUID()],
      attempts = await Promise.allSettled(
        events.map((event) => h.reserve(event, "owner", "759048")),
      );
    expect(attempts.filter((result) => result.status === "fulfilled")).toHaveLength(2);
    expect((await h.command("groupbuys.info", {})).body.totalBuy).toEqual(sfs.int(0));
    for (const [i, result] of attempts.entries())
      if (result.status === "fulfilled") {
        await expect(h.pay(events[i]!)).rejects.toThrow();
        h.prove(events[i]!, "owner", "759048");
        await h.pay(events[i]!);
        await h.pay(events[i]!);
        await expect(h.pay(events[i]!, "other")).rejects.toThrow();
      }
    const [row] = await h.db.db.select().from(alliance_group_buys);
    expect(row).toMatchObject({ uid: "owner", point: 10, reward: 0, round: 1 });
    expect(await h.db.db.select().from(mail)).toHaveLength(2);
    const info = (await h.command("groupbuys.info", {})).body;
    expect(info.totalBuy).toEqual(sfs.int(10));
    expect(info.canBuy).toEqual(sfs.bool(false));
    expect(info.buyCode).toEqual(sfs.string("151970"));
    expect(info.exchangeArr?.type).toBe(17);
  } finally {
    await h.close();
  }
}, 120000);
test("group-buy finality waits for uncertain orders and reconciliation then funds each point once after a receipt rollback", async () => {
  const h = await fixture();
  try {
    const paid = randomUUID(),
      pending = randomUUID();
    await h.reserve(paid);
    await h.reserve(pending, "other");
    h.prove(paid);
    await h.pay(paid);
    await expect(h.closeRound()).rejects.toThrow();
    h.clock.now = h.period.rounds[0]!.cTime + 1;
    h.totals.set(1, 1);
    await expect(h.closeRound()).rejects.toThrow();
    await expect(h.cancel(pending, "other")).rejects.toThrow();
    h.cancelled.add(`other:${pending}`);
    await h.cancel(pending, "other");
    h.totals.set(1, 2);
    await expect(h.closeRound()).rejects.toThrow();
    h.totals.set(1, 1);
    await h.closeRound();
    expect(await pendingGroupBuys(h.db.db)).toHaveLength(1);
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_group_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_group_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_group_receipt()`,
    );
    await expect(h.settle()).rejects.toThrow();
    expect(
      (await h.db.db.select().from(alliance_group_buys)).find((row) => row.uid === "owner")!.reward,
    ).toBe(0);
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_group_receipt ON opencok_kingdom.command_receipt`,
    );
    await Promise.all([h.settle(), h.settle()]);
    const mails = await h.db.db.select().from(mail);
    expect(mails).toHaveLength(2);
    expect(mails.filter((row) => row.rewardStatus === 0 && row.rewardId)).toHaveLength(1);
    expect(await pendingGroupBuys(h.db.db)).toHaveLength(0);
    const [activity] = await h.db.db.select().from(activity_group_buys);
    expect(groupBuyRounds(activity!.roundInfo)[0]).toMatchObject({
      flag: 1,
      total: 1,
      mail: "12031",
    });
  } finally {
    await h.close();
  }
}, 120000);
test("late verified group buys settle their original round after event expiry and cannot enter a new round", async () => {
  const h = await fixture();
  try {
    const event = randomUUID();
    await h.reserve(event);
    h.prove(event);
    h.clock.now = h.period.rounds[1]!.sTime + 1000;
    const next = randomUUID();
    await h.reserve(next);
    h.prove(next, "owner", "759047", 2);
    await h.pay(next);
    h.clock.now = Number(h.period.end) + 1000;
    await h.pay(event);
    h.totals.set(1, 1);
    await h.closeRound();
    await h.settle();
    expect((await h.command("groupbuys.info", {})).body.totalBuy).toBeUndefined();
    const rows = await h.db.db.select().from(alliance_group_buys);
    expect(rows.find((row) => row.round === 1)).toMatchObject({ point: 1, reward: 1 });
    expect(rows.find((row) => row.round === 2)).toMatchObject({ point: 1, reward: 0 });
    expect(await pendingGroupBuys(h.db.db, { id: h.id, round: 1, owner: "owner" })).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("group-buy visibility enforces opening age and cross-realm gates while unresolved holds retain capacity", async () => {
  const h = await fixture(false);
  try {
    const event = randomUUID();
    await h.reserve(event);
    h.prove(event);
    await expect(h.pay(event)).rejects.toThrow();
    await expect(h.cancel(event)).rejects.toThrow();
    await h.db.db
      .update(server_info)
      .set({ activityTime: 0n })
      .where(eq(server_info.uid, "server"));
    expect((await h.command("groupbuys.info", {})).body.totalBuy).toBeUndefined();
    await h.db.db
      .update(server_info)
      .set({ activityTime: BigInt(h.clock.now - 31 * 86400000) })
      .where(eq(server_info.uid, "server"));
    await h.db.db
      .update(userprofile)
      .set({ crossFightSrcServerId: 2 })
      .where(eq(userprofile.uid, "owner"));
    expect((await h.command("groupbuys.info", {})).body.totalBuy).toBeUndefined();
    expect((await h.db.db.select().from(alliance_group_buys))[0]!.point).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
test("legacy closed rounds resume unpaid mail points without reopening or changing imported purchases", async () => {
  const h = await fixture(false);
  try {
    await h.command("groupbuys.info", {});
    const rounds = h.period.rounds.map(({ tiers: _tiers, ...round }) => ({ ...round, flag: 1 }));
    await h.db.db
      .update(activity_group_buys)
      .set({ curRound: 0, roundInfo: JSON.stringify(rounds) })
      .where(eq(activity_group_buys.id, h.id));
    await h.db.db.insert(alliance_group_buys).values({
      id: h.id,
      uid: "owner",
      round: 1,
      name: "Imported synthetic buyer",
      allianceId: "old",
      point: 14,
      reward: 13,
      buyTime: BigInt(h.clock.now),
      info: `759047:${h.clock.now}`,
    });
    h.clock.now = Number(h.period.end) + 1000;
    expect(await pendingGroupBuys(h.db.db)).toHaveLength(1);
    await h.settle();
    await h.settle();
    const [row] = await h.db.db.select().from(alliance_group_buys);
    expect(row).toMatchObject({
      point: 14,
      reward: 14,
      info: `759047:${Date.UTC(2023, 0, 1, 12)}`,
    });
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
    expect(await pendingGroupBuys(h.db.db)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("a held group-buy round lock fails within its deadline without creating a reservation", async () => {
  const h = await fixture(),
    held = Promise.withResolvers<void>(),
    release = Promise.withResolvers<void>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const blocker = h.db.db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(728217,1)`);
    held.resolve();
    await release.promise;
  });
  try {
    await held.promise;
    timer = setTimeout(() => release.resolve(), 4000);
    const started = performance.now();
    await expect(h.reserve()).rejects.toThrow();
    expect(performance.now() - started).toBeLessThan(3500);
    expect(await h.db.db.select().from(alliance_group_buys)).toHaveLength(0);
  } finally {
    clearTimeout(timer);
    release.resolve();
    await blocker;
    await h.close();
  }
}, 120000);
