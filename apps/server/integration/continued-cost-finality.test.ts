import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { costRankingFixture } from "./support/continued-cost";
import { ContinuedCostFinalityService } from "@opencok/services/continued-cost-finality";
import {
  createCostFinalityOwned,
  createCostFinalityShared,
} from "@opencok/repositories/continued-cost-finality";
import { createCostRankingFacts } from "@opencok/repositories/continued-cost-ranking";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { costScoreDigest, readCostScoreSnapshot } from "@opencok/rules/continued-cost-finality";
import { continued_cost_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_closure";
import { continued_cost_rank_watermark as marks } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_watermark";
import { continued_cost_rank_period as periods } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_period";
import { continued_cost_rank_score as scores } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_score";
import { continued_cost_score as ownedScores } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_score";
import { continued_cost_fact as facts } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { nickname_change } from "@opencok/drizzle/schema/opencok_kingdom/nickname_change";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
async function fixture() {
  const h = await costRankingFixture(),
    owned = createCostFinalityOwned(h.db.db, h.authority),
    shared = createCostFinalityShared(h.global.db, h.authority),
    owned2 = createCostFinalityOwned(h.second.db, h.authority2),
    shared2 = createCostFinalityShared(h.global.db, h.authority2),
    now = () => h.clock.now;
  return {
    ...h,
    owned,
    shared,
    owned2,
    shared2,
    finality: new ContinuedCostFinalityService(h.source, owned, shared, now),
    finality2: new ContinuedCostFinalityService(h.source2, owned2, shared2, now),
  };
}
test("consumption finality waits for grace and every registered realm, including verified empty realms", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    h.clock.now = Number(h.plan.endTime) + 299999;
    await h.finality.refresh();
    expect(await h.db.db.select().from(closures)).toHaveLength(0);
    h.clock.now++;
    await h.finality.refresh();
    expect(await h.global.db.select().from(marks)).toHaveLength(1);
    expect((await h.global.db.select().from(periods))[0]?.state).toBe(0);
    expect(await h.shared.standings(h.plan.id)).toBeUndefined();
    h.rules2.features.delete("continued_cost");
    h.rules2.features.delete("new_rank_cost");
    await h.finality2.refresh();
    await h.finality.refresh();
    expect((await h.second.db.select().from(closures))[0]?.scoreCount).toBe(0);
    expect((await h.global.db.select().from(periods))[0]?.state).toBe(1);
    expect((await h.db.db.select().from(closures))[0]?.phase).toBe(2);
    expect((await h.shared.standings(h.plan.id))?.map((row) => row.uid)).toEqual(["owner"]);
    const saved = await h.global.db.select().from(periods);
    h.clock.now += 60000;
    await h.finality.refresh();
    await h.finality2.refresh();
    expect(await h.global.db.select().from(periods)).toEqual(saved);
  } finally {
    await h.close();
  }
}, 120000);
test("a realm proof freezes exact economic values before cohort finality while current privacy can refresh", async () => {
  const h = await fixture();
  try {
    const large = 9007199254740993n;
    await h.db.db
      .update(userprofile)
      .set({ gold: large + 100n })
      .where(eq(userprofile.uid, "owner"));
    await h.spend(large);
    await h.spend2();
    await h.service.refresh();
    await h.service2.refresh();
    h.clock.now = Number(h.plan.endTime) + 300000;
    await h.finality.refresh();
    const closure = (await h.db.db.select().from(closures))[0]!,
      frozen = readCostScoreSnapshot(closure.snapshot);
    expect(frozen[0]?.score).toBe(large);
    expect(closure.digest).toBe(costScoreDigest(frozen));
    await h.registry.write(
      h.plan,
      [{ ...frozen[0]!, score: 1n, paid: 0n, free: 1n }],
      BigInt(h.clock.now),
    );
    await h.registry.write(h.plan, [], BigInt(h.clock.now));
    expect((await h.global.db.select().from(scores).where(eq(scores.uid, "owner")))[0]?.score).toBe(
      large,
    );
    await h.db.db
      .insert(user_mixed_info)
      .values({ uid: "owner", mdata: "synthetic", costHide: 1 })
      .onConflictDoUpdate({ target: user_mixed_info.uid, set: { costHide: 1 } });
    await h.service.refresh();
    await h.finality.refresh();
    expect(
      JSON.parse(
        (await h.global.db.select().from(scores).where(eq(scores.uid, "owner")))[0]!.metadata,
      ).hideKing,
    ).toBe(1);
    await h.finality2.refresh();
    await h.finality.refresh();
    expect((await h.shared.standings(h.plan.id))?.map((row) => [row.uid, row.score])).toEqual([
      ["owner", large],
      ["remote", 10n],
    ]);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption seal and shared proof rollback independently and resume under replacement authority", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    h.clock.now = Number(h.plan.endTime) + 300000;
    await h.db.pool.query(
      `create function reject_cost_seal() returns trigger language plpgsql as $$ begin raise exception 'synthetic seal failure'; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_cost_seal before insert on opencok_kingdom.continued_cost_closure for each row execute function reject_cost_seal()`,
    );
    await expect(h.finality.refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(closures)).toHaveLength(0);
    await h.db.pool.query(
      `drop trigger reject_cost_seal on opencok_kingdom.continued_cost_closure`,
    );
    await h.global.pool.query(
      `create function reject_cost_proof() returns trigger language plpgsql as $$ begin raise exception 'synthetic proof failure'; end $$`,
    );
    await h.global.pool.query(
      `create trigger reject_cost_proof before insert on opencok_global.continued_cost_rank_watermark for each row execute function reject_cost_proof()`,
    );
    await expect(h.finality.refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(closures)).toHaveLength(1);
    expect(await h.global.db.select().from(marks)).toHaveLength(0);
    await h.global.pool.query(
      `drop trigger reject_cost_proof on opencok_global.continued_cost_rank_watermark`,
    );
    const replacement = await acquireRealmAuthority(h.db.db, 1, () => true),
      next = new ContinuedCostFinalityService(
        createCostRankingFacts(h.db.db, replacement),
        createCostFinalityOwned(h.db.db, replacement),
        createCostFinalityShared(h.global.db, replacement),
        () => h.clock.now,
      );
    await next.refresh();
    await expect(h.finality.refresh()).rejects.toThrow();
    await h.finality2.refresh();
    await next.refresh();
    expect((await h.db.db.select().from(closures))[0]?.phase).toBe(2);
    expect((await h.global.db.select().from(periods))[0]?.state).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption closure waits for confirmed legacy recovery and prepared financial reservations but preserves late debit evidence", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    const frame = (await h.db.db.select().from(mutation_outbox)).find(
      (row) => row.eventType === "continuedcost.spend",
    )!;
    const operation = randomUUID(),
      before = {
        gold: "100",
        paidGold: "0",
        paidSpecialGold: "0",
        dmmGold: "0",
        dmmPaidGold: "0",
        dmmPaidSpecialGold: "0",
      };
    await h.db.db.insert(nickname_change).values({
      operationId: operation,
      ownerUid: "other",
      newName: "Pending",
      previousName: "Synthetic",
      state: "prepared",
      payment: JSON.stringify({
        version: 1,
        kind: "gold",
        platform: null,
        price: "10",
        before,
        after: { ...before, gold: "90" },
        pendingEvent: {
          id: frame.eventId,
          type: frame.eventType,
          payload: frame.payload.toString("base64"),
        },
      }),
      responseGold: 90n,
      createdAt: BigInt(h.clock.now),
      updatedAt: BigInt(h.clock.now),
    });
    await h.db.db.delete(facts);
    await h.db.db.delete(ownedScores);
    const recovery = new ContinuedCostFinalityService(
      createCostRankingFacts(h.db.db, h.authority),
      h.owned,
      h.shared,
      () => h.clock.now,
    );
    h.clock.now = Number(h.plan.endTime) + 300000;
    await recovery.refresh();
    expect(await h.db.db.select().from(facts)).toHaveLength(1);
    expect(await h.db.db.select().from(closures)).toHaveLength(0);
    await h.db.db
      .update(nickname_change)
      .set({ state: "refunded" })
      .where(eq(nickname_change.operationId, operation));
    await h.finality.refresh();
    expect(await h.db.db.select().from(closures)).toHaveLength(1);
    h.clock.now = Number(h.plan.startTime) + 86400000;
    await h.spend(10n);
    expect((await h.db.db.select().from(facts)).map((row) => row.counted).toSorted()).toEqual([
      0, 1,
    ]);
    expect((await h.db.db.select().from(ownedScores))[0]?.total).toBe(10n);
  } finally {
    await h.close();
  }
}, 120000);
test("pending owned progression defers consumption closure and exact ties retain ascending identities", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.spend2();
    await h.service.refresh();
    await h.service2.refresh();
    await h.db.db.insert(queue).values({
      uuid: "synthetic-cost-queue",
      ownerId: "owner",
      qid: 1,
      endTime: h.plan.endTime - 1n,
      type: 1,
      itemId: "synthetic",
      updateTime: h.plan.endTime - 1n,
    });
    h.clock.now = Number(h.plan.endTime) + 300000;
    await h.finality.refresh();
    expect(await h.db.db.select().from(closures)).toHaveLength(0);
    await h.db.db.delete(queue).where(eq(queue.uuid, "synthetic-cost-queue"));
    await h.finality.refresh();
    await h.finality2.refresh();
    await h.finality.refresh();
    expect((await h.shared.standings(h.plan.id))?.map((row) => row.uid)).toEqual([
      "owner",
      "remote",
    ]);
  } finally {
    await h.close();
  }
}, 120000);
test("corrupt consumption proofs or shared economic rows cannot finalize a cohort", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.service.refresh();
    h.clock.now = Number(h.plan.endTime) + 300000;
    const seal = (await h.owned.seal(h.plan, BigInt(h.clock.now)))!;
    await expect(
      h.shared.prove(h.plan, { ...seal, digest: "0".repeat(64) }, BigInt(h.clock.now)),
    ).rejects.toThrow();
    expect(await h.global.db.select().from(marks)).toHaveLength(0);
    await h.shared.prove(h.plan, seal, BigInt(h.clock.now));
    await h.global.db.update(scores).set({ score: 11n }).where(eq(scores.uid, "owner"));
    await expect(h.finality2.refresh()).rejects.toThrow();
    expect((await h.global.db.select().from(periods))[0]?.state).toBe(0);
    await h.global.db.update(scores).set({ score: 10n }).where(eq(scores.uid, "owner"));
    await h.finality.refresh();
    expect((await h.global.db.select().from(periods))[0]?.state).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
