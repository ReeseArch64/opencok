import { continued_cost_rank_score as sharedScores } from "@opencok/drizzle/schema/opencok_global/continued_cost_rank_score";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { costRankingFixture } from "./support/continued-cost";
import {
  ContinuedCostRewardService,
  continuedCostRewardDomain,
} from "@opencok/services/continued-cost-rewards";
import { ContinuedCostFinalityService } from "@opencok/services/continued-cost-finality";
import {
  createCostFinalityOwned,
  createCostFinalityShared,
} from "@opencok/repositories/continued-cost-finality";
import { createCostRankAwardStore } from "@opencok/repositories/continued-cost-rewards";
import { costRankAwardOperation, costRankMail } from "@opencok/rules/continued-cost-rewards";
import { continued_cost_rank_award as awards } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_rank_award";
import { continued_cost_closure as closures } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_closure";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { sfs } from "@opencok/messages/sfs";
import type { CostRankingRegistry } from "@opencok/contracts/continued-cost-ranking";
async function fixture() {
  const h = await costRankingFixture([continuedCostRewardDomain]),
    now = () => h.clock.now,
    shared = createCostFinalityShared(h.global.db, h.authority),
    shared2 = createCostFinalityShared(h.global.db, h.authority2),
    store = createCostRankAwardStore(h.db.db, h.authority),
    finality = new ContinuedCostFinalityService(
      h.source,
      createCostFinalityOwned(h.db.db, h.authority),
      shared,
      now,
    ),
    finality2 = new ContinuedCostFinalityService(
      h.source2,
      createCostFinalityOwned(h.second.db, h.authority2),
      shared2,
      now,
    );
  const deliver = (owner: string, id: string) =>
    h.command(
      "continuedcost.rank.deliver",
      { awardId: sfs.string(id), operationId: sfs.string(costRankAwardOperation(id)) },
      owner,
    );
  return {
    ...h,
    shared,
    shared2,
    store,
    deliver,
    rewards: (delivery = deliver, registry: Pick<CostRankingRegistry, "get"> = h.registry) =>
      new ContinuedCostRewardService(store, registry, shared, h.rules, delivery, now),
    seal: async () => {
      await h.service.refresh();
      await h.service2.refresh();
      h.clock.now = Number(h.plan.endTime) + 300000;
      await finality.refresh();
      await finality2.refresh();
      await finality.refresh();
    },
  };
}
test("final consumption rankings fund native rank mail once in the winner's realm and funded claims cannot repeat assets", async () => {
  const h = await fixture();
  try {
    await h.spend(20n);
    await h.spend2();
    await h.seal();
    await h.rewards().refresh();
    const saved = (await h.db.db.select().from(awards))[0]!,
      messages = await h.db.db.select().from(mail),
      target = messages.find((row) => row.uid === saved.id + "00")!;
    expect(saved.ownerUid).toBe("owner");
    expect(saved.rank).toBe(1);
    expect(saved.deliveredAt).toBeGreaterThan(0n);
    expect(target.type).toBe(2);
    expect(target.rewardStatus).toBe(0);
    expect(target.rewardId).toBe(costRankMail(saved.payload).reward);
    await h.deliver("owner", saved.id);
    await h.rewards().refresh();
    expect(await h.db.db.select().from(mail)).toEqual(messages);
    expect((await h.db.db.select().from(closures))[0]?.awardedAt).toBeGreaterThan(0n);
    const remoteStore = createCostRankAwardStore(h.second.db, h.authority2);
    await new ContinuedCostRewardService(
      remoteStore,
      h.registry2,
      h.shared2,
      h.rules2,
      async () => {
        throw new Error("Synthetic unavailable remote delivery");
      },
      () => h.clock.now,
    ).refresh();
    const remote = (await h.second.db.select().from(awards))[0]!;
    expect(remote.ownerUid).toBe("remote");
    expect(remote.rank).toBe(2);
    expect(await h.db.db.select().from(awards)).toHaveLength(1);
    const claims = new MailRewardService(
      createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
      h.rules,
    );
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(target.uid),
      operationId: sfs.string(randomUUID()),
    });
    const items = await h.db.db.select().from(user_item);
    expect(items.length).toBeGreaterThan(0);
    await claims.command("owner", "mail.reward", {
      uid: sfs.string(target.uid),
      operationId: sfs.string(randomUUID()),
    });
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "continuedcost.rank.mail",
      ),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("consumption reward admission and delivery failures restore their cursor, mail, acknowledgement and outbox", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.seal();
    await h.db.pool.query(
      `create function reject_cost_award() returns trigger language plpgsql as $$ begin raise exception 'synthetic award failure'; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_cost_award before insert on opencok_kingdom.continued_cost_rank_award for each row execute function reject_cost_award()`,
    );
    await expect(h.rewards().refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(awards)).toHaveLength(0);
    expect((await h.db.db.select().from(closures))[0]?.awardCursor).toBe(0);
    await h.db.pool.query(
      `drop trigger reject_cost_award on opencok_kingdom.continued_cost_rank_award`,
    );
    await h.db.pool.query(
      `create function reject_cost_delivery() returns trigger language plpgsql as $$ begin if new.command='continuedcost.rank.deliver' then raise exception 'synthetic delivery failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_cost_delivery before insert on opencok_kingdom.command_receipt for each row execute function reject_cost_delivery()`,
    );
    await h.rewards().refresh();
    const saved = (await h.db.db.select().from(awards))[0]!;
    expect(saved.deliveredAt).toBe(0n);
    expect(await h.db.db.select().from(mail)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "continuedcost.rank.mail",
      ),
    ).toHaveLength(0);
    await h.db.pool.query(`drop trigger reject_cost_delivery on opencok_kingdom.command_receipt`);
    h.clock.now += 60000;
    await h.rewards().refresh();
    expect((await h.db.db.select().from(awards))[0]?.payload).toBe(saved.payload);
    expect((await h.db.db.select().from(awards))[0]?.deliveredAt).toBeGreaterThan(0n);
    expect(await h.db.db.select().from(mail)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("banned consumption winners defer without preventing eligible winners and wrong owners cannot deliver a prize", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.command("synthetic.spend", { gold: sfs.long(20n) }, "other");
    await h.seal();
    await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "owner"));
    await h.rewards().refresh();
    const saved = await h.db.db.select().from(awards),
      owner = saved.find((row) => row.ownerUid === "owner")!;
    expect(owner.deliveredAt).toBe(0n);
    expect(saved.find((row) => row.ownerUid === "other")?.deliveredAt).toBeGreaterThan(0n);
    await expect(h.deliver("other", owner.id)).rejects.toThrow();
    await h.db.db.update(userprofile).set({ banFlag: 0 }).where(eq(userprofile.uid, "owner"));
    h.clock.now += 60000;
    await h.rewards().refresh();
    expect((await h.db.db.select().from(awards)).every((row) => row.deliveredAt > 0n)).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("stored consumption prizes drain during shared admission failure, preserve pinned outcomes and resume a bounded 65-winner tail", async () => {
  const h = await fixture();
  try {
    const ids = Array.from({ length: 65 }, (_, i) => `z${String(i).padStart(3, "0")}`),
      resource = (
        await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
      )[0]!;
    await h.db.db.insert(userprofile).values(
      ids.map((uid) => ({
        uid,
        name: "Synthetic",
        country: "BR",
        serverId: 1,
        level: 1,
        exp: 0,
        gold: 1000n,
      })),
    );
    await h.db.db.insert(user_resource).values(ids.map((uid) => ({ ...resource, uid })));
    await h.db.db
      .insert(user_building)
      .values(ids.map((uid) => ({ uuid: `castle-${uid}`, uid, itemId: 400000, pos: 0, level: 1 })));
    for (const uid of ids) {await h.command("synthetic.spend", { gold: sfs.long(10n) }, uid);}
    await h.seal();
    await h
      .rewards(async () => {
        throw new Error("Synthetic unavailable delivery");
      })
      .refresh();
    const saved = await h.db.db.select().from(awards);
    expect(saved).toHaveLength(64);
    expect((await h.db.db.select().from(closures))[0]?.awardCursor).toBe(64);
    expect((await h.db.db.select().from(closures))[0]?.awardedAt).toBe(0n);
    const rewards = new Map(h.rules.reconnect.rewards);
    for (const id of ["236039", "236040", "236042"]) {h.rules.reconnect.rewards!.delete(id);}
    h.clock.now += 60000;
    await expect(
      h
        .rewards(h.deliver, {
          get: async () => {
            throw new Error("Synthetic unavailable shared admission");
          },
        })
        .refresh(),
    ).rejects.toThrow();
    expect(await h.db.db.select().from(mail)).toHaveLength(64);
    expect(
      (await h.db.db.select().from(awards)).every(
        (row) =>
          row.deliveredAt > 0n &&
          saved.some((old) => old.id === row.id && old.payload === row.payload),
      ),
    ).toBe(true);
    for (const [id, row] of rewards) {h.rules.reconnect.rewards!.set(id, row);}
    await h.rewards().refresh();
    expect(await h.db.db.select().from(awards)).toHaveLength(65);
    expect(await h.db.db.select().from(mail)).toHaveLength(65);
    expect((await h.db.db.select().from(closures))[0]?.awardedAt).toBeGreaterThan(0n);
  } finally {
    await h.close();
  }
}, 180000);
test("consumption ranking prizes require finalized shared standings and missing profiles do not invent recipients", async () => {
  const h = await fixture();
  try {
    await h.spend(10n);
    await h.command("synthetic.spend", { gold: sfs.long(20n) }, "other");
    await h.service.refresh();
    await h.rewards().refresh();
    expect(await h.db.db.select().from(awards)).toHaveLength(0);
    await h.seal();
    await h.global.db.update(sharedScores).set({ score: 11n }).where(eq(sharedScores.uid, "owner"));
    await expect(h.rewards().refresh()).rejects.toThrow();
    expect(await h.db.db.select().from(awards)).toHaveLength(0);
    await h.global.db.update(sharedScores).set({ score: 10n }).where(eq(sharedScores.uid, "owner"));
    await h.db.db
      .update(userprofile)
      .set({ regTime: BigInt(h.clock.now) + 1n })
      .where(eq(userprofile.uid, "other"));
    await h.db.db.delete(userprofile).where(eq(userprofile.uid, "owner"));
    await h.rewards().refresh();
    expect(await h.db.db.select().from(awards)).toHaveLength(0);
    expect((await h.db.db.select().from(closures))[0]?.awardedAt).toBeGreaterThan(0n);
  } finally {
    await h.close();
  }
}, 120000);
