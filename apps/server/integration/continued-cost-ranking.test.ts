import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { usermapping } from "@opencok/drizzle/schema/opencok_global/usermapping";
import { createNicknameChangeStore } from "@opencok/repositories/nickname-change";
import { confirmedNicknameCost } from "@opencok/services/continued-cost-spending";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { ContinuedCostRankingService } from "@opencok/services/continued-cost-ranking";
import {
  createCostRankingFacts,
  createCostRankingRegistry,
} from "@opencok/repositories/continued-cost-ranking";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { costRankingPlan } from "@opencok/rules/continued-cost-ranking";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { activity_cost } from "@opencok/drizzle/schema/opencok_kingdom/activity_cost";
import { continued_cost_fact as facts } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { continued_cost_score as scores } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_score";
import { continued_cost_period as periods } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_period";
import { continued_cost_rank_score as sharedScores } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_score";
import { continued_cost_rank_period as sharedPeriods } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_period";
import { continued_cost_rank_owner as sharedOwners } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_owner";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, str } from "@opencok/messages/sfs";
import { costRankingFixture as fixture } from "./support/continued-cost";
test("confirmed consumption ranks publish real debits across realms with exact signed 64-bit values, privacy and replay safety", async () => {
  const h = await fixture();
  try {
    const amount = 9007199254740993n;
    await h.db.db
      .update(userprofile)
      .set({ gold: amount + 10n })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(user_mixed_info)
      .values({ uid: "owner", mdata: "synthetic-preserved", costHide: 1 })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { costHide: 1 } });
    const operation = randomUUID();
    await h.spend(amount, operation);
    await h.spend(amount, operation);
    await h.spend2();
    expect(await h.db.db.select().from(facts)).toHaveLength(1);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(amount);
    await h.service.refresh();
    await h.service2.refresh();
    const board = (await h.registry.board(h.plan.id))!.map(decodeLegacyJsonObject);
    expect(board.map((row) => str(row, "uid"))).toEqual(["owner", "remote"]);
    expect(board[0]!.val).toEqual(sfs.long(amount));
    expect(board[0]!.sid).toEqual(sfs.string("1"));
    expect(board[0]!.hideKing).toEqual(sfs.int(1));
    const saved = await h.registry.board(h.plan.id);
    await h.service.refresh();
    expect(await h.registry.board(h.plan.id)).toEqual(saved);
    expect(
      (await h.global.db.select().from(sharedScores)).find((row) => row.uid === "owner")?.score,
    ).toBe(amount);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "continuedcost.spend" && row.publishedAt === 0n,
      ),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption facts, actual debits, receipts and outbox roll back together before retry", async () => {
  const h = await fixture();
  try {
    const before = (
        await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
      )[0]!.gold,
      operation = randomUUID();
    await h.db.pool.query(
      `create function reject_cost_fact() returns trigger language plpgsql as $$ begin raise exception 'synthetic fact failure'; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_cost_fact before insert on opencok_kingdom.continued_cost_fact for each row execute function reject_cost_fact()`,
    );
    await expect(h.spend(10n, operation)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(before);
    expect(await h.db.db.select().from(facts)).toHaveLength(0);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query(`drop trigger reject_cost_fact on opencok_kingdom.continued_cost_fact`);
    await h.spend(10n, operation);
    expect(await h.db.db.select().from(facts)).toHaveLength(1);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(10n);
  } finally {
    await h.close();
  }
}, 120000);
test("old confirmed outbox events backfill once independently of ban and delivery state while unproven legacy totals remain local", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.db.db.delete(facts);
    await h.db.db.delete(scores);
    await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(activity_cost).values({
      uid: "other",
      type: 1,
      periodStart: h.plan.startTime,
      total: 999999n,
      updateTime: h.plan.startTime + 1n,
    });
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(1);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(0);
    await h.service.refresh();
    const board = (await h.registry.board(h.plan.id))!.map(decodeLegacyJsonObject);
    expect(board.map((row) => str(row, "uid"))).toEqual(["owner"]);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(10n);
    expect((await h.db.db.select().from(activity_cost))[0]?.total).toBe(999999n);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption score publication is absolute, keeps first-bound rewards and census, and rejects replaced owners", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    const initial = (await h.global.db.select().from(sharedPeriods))[0]!;
    await h.service.refresh();
    expect((await h.global.db.select().from(sharedPeriods))[0]?.revision).toBe(initial.revision);
    h.rules.items.set("continued_cost", {
      ...h.rules.items.get("continued_cost")!,
      k5: "1;100;236042",
    });
    await new ContinuedCostRankingService(
      h.source,
      h.registry,
      h.rules,
      [1, 2, 3],
      () => h.clock.now,
    ).refresh();
    expect((await h.global.db.select().from(sharedPeriods))[0]?.expectedRealms).toBe("1|2");
    expect((await h.global.db.select().from(sharedPeriods))[0]?.rewards).toBe(initial.rewards);
    const replacement = await acquireRealmAuthority(h.db.db, 1, () => true);
    const next = new ContinuedCostRankingService(
      createCostRankingFacts(h.db.db, replacement),
      createCostRankingRegistry(h.global.db, replacement),
      h.rules,
      [1, 2],
      () => h.clock.now,
    );
    await next.refresh();
    await expect(h.service.refresh()).rejects.toThrow();
    expect((await h.global.db.select().from(sharedOwners))[0]?.ownerEpoch).toBe(replacement.epoch);
    expect((await h.global.db.select().from(sharedScores))[0]?.score).toBe(10n);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption backfill drains a bounded tail once and retains separate economic periods across rollover", async () => {
  const h = await fixture();
  try {
    for (let i = 0; i < 65; i++) {await h.spend(10n);}
    await h.db.db.delete(facts);
    await h.db.db.delete(scores);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(64);
    expect(await h.db.db.select().from(facts)).toHaveLength(64);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(1);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(0);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(650n);
    await h.service.refresh();
    h.rules.power.activityPanels!.set("57159", {
      ...h.rules.power.activityPanels!.get("57159")!,
      start: "2030-02-01-00-00",
      end: "2030-02-10-00-00",
    });
    h.clock.now = Date.UTC(2030, 1, 2);
    await h.spend(10n);
    await h.service.refresh();
    const next = costRankingPlan(h.rules, [1, 2])!;
    expect(await h.db.db.select().from(periods)).toHaveLength(2);
    expect(decodeLegacyJsonObject((await h.registry.board(h.plan.id))![0]!).val?.value).toBe(650);
    expect(decodeLegacyJsonObject((await h.registry.board(next.id))![0]!).val?.value).toBe(10);
  } finally {
    await h.close();
  }
}, 120000);
test("a foreign consumption identity or failed shared write rolls back its version and resumes from the same absolute facts", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.spend2();
    await h.service.refresh();
    await h.service2.refresh();
    const before = await h.global.db.select().from(sharedScores),
      versions = await h.global.db.select().from(sharedOwners),
      remote = (await h.source2.top(h.plan))[0]!;
    expect(
      (await h.registry.board(h.plan.id))!.map((value) =>
        str(decodeLegacyJsonObject(value), "uid"),
      ),
    ).toEqual(["owner", "remote"]);
    await expect(
      h.registry2.write(h.plan, [{ ...remote, uid: "owner" }], BigInt(h.clock.now)),
    ).rejects.toThrow();
    expect(await h.global.db.select().from(sharedScores)).toEqual(before);
    expect(await h.global.db.select().from(sharedOwners)).toEqual(versions);
    await h.spend(10n);
    await h.global.pool.query(
      `create function reject_cost_rank() returns trigger language plpgsql as $$ begin if new."kingdomId"=1 then raise exception 'synthetic global failure'; end if; return new; end $$`,
    );
    await h.global.pool.query(
      `create trigger reject_cost_rank before update on opencok_global.continued_cost_rank_score for each row execute function reject_cost_rank()`,
    );
    await expect(h.service.refresh()).rejects.toThrow();
    expect(
      (
        await h.global.db
          .select()
          .from(sharedScores)
          .where(and(eq(sharedScores.uid, "owner"), eq(sharedScores.kingdomId, 1)))
      )[0]?.score,
    ).toBe(10n);
    expect(await h.global.db.select().from(sharedOwners)).toEqual(versions);
    await h.global.pool.query(
      `drop trigger reject_cost_rank on opencok_global.continued_cost_rank_score`,
    );
    await h.service.refresh();
    expect(
      (await h.global.db.select().from(sharedScores).where(eq(sharedScores.uid, "owner")))[0]
        ?.score,
    ).toBe(20n);
  } finally {
    await h.close();
  }
}, 120000);
test("sealed consumption snapshots retain late debit evidence without changing frozen scores while privacy remains current", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    await h.db.db.update(periods).set({ state: 1 }).where(eq(periods.id, h.plan.id));
    await h.global.db
      .update(sharedPeriods)
      .set({ state: 1, finalizedAt: h.plan.endTime })
      .where(eq(sharedPeriods.id, h.plan.id));
    await h.spend(10n);
    const evidence = await h.db.db.select().from(facts);
    expect(evidence).toHaveLength(2);
    expect(evidence.map((row) => row.counted).toSorted()).toEqual([0, 1]);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(10n);
    await h.db.db
      .insert(user_mixed_info)
      .values({ uid: "owner", mdata: "synthetic-preserved", costHide: 1 })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { costHide: 1 } });
    await h.service.refresh();
    const board = decodeLegacyJsonObject((await h.registry.board(h.plan.id))![0]!);
    expect(board.val?.value).toBe(10);
    expect(board.hideKing).toEqual(sfs.int(1));
  } finally {
    await h.close();
  }
}, 120000);
test("committed nickname debits capture facts and legacy outbox recovery verifies the persisted payment witness", async () => {
  const h = await fixture();
  try {
    await h.global.db.insert(account_new).values({
      gameUid: "owner",
      server: "1",
      uuid: "synthetic-device",
      gameUserName: "Synthetic",
      gameUserLevel: 1,
      lastTime: 0n,
    });
    await h.global.db
      .insert(usermapping)
      .values({ gameUid: "owner", mappingType: "name", mappingValue: "Synthetic" });
    const store = createNicknameChangeStore(
        {
          global: h.global,
          getKingdom: (id) => {
            if (id === 1) {return h.db;}
            if (id === 2) {return h.second;}
            throw new Error("Unconfigured synthetic realm");
          },
        },
        1,
        {
          itemType: () => "17",
          price: () => "10",
          refundRatio: async () => 1,
          confirmedSpending: confirmedNicknameCost(h.rules),
        },
      ),
      operation = randomUUID();
    const changed = await store.change("owner", operation, "Confirmed Spend", h.clock.now);
    expect(changed.state).toBe("committed");
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(10n);
    expect(await h.db.db.select().from(facts)).toHaveLength(1);
    expect(await h.db.db.select().from(economy_posting)).toHaveLength(0);
    await h.db.db.delete(facts);
    await h.db.db.delete(scores);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(1);
    await h.service.refresh();
    expect(decodeLegacyJsonObject((await h.registry.board(h.plan.id))![0]!).val?.value).toBe(10);
    await store.change("owner", operation, "Confirmed Spend", h.clock.now);
    expect(await h.db.db.select().from(facts)).toHaveLength(1);
    expect((await h.db.db.select().from(scores))[0]?.total).toBe(10n);
  } finally {
    await h.close();
  }
}, 120000);
test("a refunded nickname reservation does not become confirmed competitive spending", async () => {
  const h = await fixture();
  try {
    await h.global.db.insert(account_new).values([
      {
        gameUid: "owner",
        server: "1",
        uuid: "synthetic-owner",
        gameUserName: "Synthetic",
        gameUserLevel: 1,
        lastTime: 0n,
      },
      {
        gameUid: "occupied",
        server: "1",
        uuid: "synthetic-occupied",
        gameUserName: "Taken Name",
        gameUserLevel: 1,
        lastTime: 0n,
      },
    ]);
    await h.global.db.insert(usermapping).values([
      { gameUid: "owner", mappingType: "name", mappingValue: "Synthetic" },
      { gameUid: "occupied", mappingType: "name", mappingValue: "Taken Name" },
    ]);
    const store = createNicknameChangeStore(
      {
        global: h.global,
        getKingdom: (id) => {
          if (id === 1) {return h.db;}
          if (id === 2) {return h.second;}
          throw new Error("Unconfigured synthetic realm");
        },
      },
      1,
      {
        itemType: () => "17",
        price: () => "10",
        refundRatio: async () => 1,
        confirmedSpending: confirmedNicknameCost(h.rules),
      },
    );
    await h.global.pool.query(
      `create function reject_nickname_confirmation() returns trigger language plpgsql as $$ begin raise exception 'synthetic confirmation failure'; end $$`,
    );
    await h.global.pool.query(
      `create trigger reject_nickname_confirmation before insert on opencok_global.nickname_change_receipt for each row execute function reject_nickname_confirmation()`,
    );
    const changed = await store.change("owner", randomUUID(), "Refunded Spend", h.clock.now);
    expect(changed.state).toBe("refunded");
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(100000n);
    expect(await h.db.db.select().from(facts)).toHaveLength(0);
    expect(await h.source.ingest(BigInt(h.clock.now))).toBe(0);
    await h.service.refresh();
    expect(await h.registry.board(h.plan.id)).toEqual([]);
  } finally {
    await h.close();
  }
}, 120000);
