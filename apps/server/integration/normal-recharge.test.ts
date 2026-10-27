import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import {
  createNormalRechargeDomain,
  normalRechargeParameters,
  normalRechargeOperation,
} from "@opencok/services/normal-recharge";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { pay_total } from "@opencok/drizzle/schema/opencok_kingdom/pay_total";
import { paylog } from "@opencok/drizzle/schema/opencok_kingdom/paylog";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import type { DeliveredGiftProof } from "@opencok/contracts/paid-gifts";
import { cityHarness } from "./support/city";
async function fixture() {
  const proofs = new Map<string, DeliveredGiftProof>();
  const gateway = {
    delivered: async ({
      owner,
      orderId,
      platform,
    }: {
      owner: string;
      orderId: string;
      platform: string;
    }) => {
      const proof = proofs.get(orderId);
      return proof?.owner === owner && proof.platform === platform ? proof : null;
    },
  };
  const h = await cityHarness([createNormalRechargeDomain(gateway)]);
  h.clock.now = Date.UTC(2030, 0, 2, 12);
  h.rules.configuration.payControl!.set("69022", {
    k1: "2.1.0",
    k2: "all",
    k5: "2030-01-01-00-00",
    k6: "2030-01-05-00-00",
    k7: "2030-01-10-00-00",
    k8: "2030-01-15-00-00",
    k9: "synthetic-face",
  });
  h.rules.features.set("merge_recharge_event", { version: "1.0.0", online: "all", test: "all" });
  await h.db.db.insert(server_info).values({ uid: "server", payTotalTime: 1n });
  h.rules.advanced.castleExchanges!.set("synthetic", {
    id: "synthetic",
    product_id: "gold_1",
    dollar: "4.99",
    gold_doller: "1700",
  });
  h.rules.reconnect.rewards!.set("990001", {
    id: "990001",
    gold: "7",
    wood: "11",
    item: "200001",
    num: "2",
    rate: "100",
    circle: "1",
  });
  h.rules.advanced.normalRechargeThresholds = new Map(
    [1, 3, 4].flatMap((type) =>
      [500, 1700].map(
        (node, index) =>
          [
            String(type * 10 + index),
            {
              id: String(type * 10 + index),
              type: String(type),
              level: String(index + 1),
              Node: String(node),
              Gift: "990001",
              important_reward: "1;2",
            },
          ] as const,
      ),
    ),
  );
  h.rules.advanced.campaignRules = [1, 2].map((level) => ({
    id: `synthetic-level-${level}`,
    state: 2,
    openType: 2,
    events: [{ code: 70, parameters: String(level) }],
    conditions: [],
    actions: [{ code: 9, parameters: "P$long_normal_levels;+;1" }],
  }));
  h.rules.advanced.campaignVariables!.set("P$long_normal_levels", {
    scope: "P",
    id: "long_normal_levels",
    initialValue: 0,
  });
  const order = async (
    id = randomUUID(),
    at = BigInt(h.clock.now),
    extra: Partial<DeliveredGiftProof> = {},
  ) => {
    const proof: DeliveredGiftProof = {
      owner: "owner",
      kingdomId: 1,
      orderId: id,
      platform: "synthetic",
      exchangeId: "synthetic",
      productId: "gold_1",
      priceCents: 499,
      occurredAt: at,
      ...extra,
    };
    proofs.set(id, proof);
    await h.db.db.insert(paylog).values({
      uid: proof.owner,
      orderId: id,
      pf: proof.platform,
      productId: proof.productId,
      time: at,
      spend: 4.99,
      status: 2,
      payLevel: 1,
    });
    return id;
  };
  const paid = (id: string, owner = "owner", platform = "synthetic") =>
    h.command(
      "normal.recharge.paid",
      { ...normalRechargeParameters(owner, id, platform), amount: sfs.long(999999999) },
      owner,
    );
  const totals = () => h.db.db.select().from(pay_total);
  const mails = () => h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
  const profile = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!;
  return { ...h, proofs, order, paid, totals, mails, profile };
}
test("normal recharge counts exact delivered catalog gold once, mails reached thresholds and grants real claimable rewards", async () => {
  const h = await fixture();
  try {
    const id = await h.order();
    const results = await Promise.all(Array.from({ length: 4 }, () => h.paid(id)));
    expect(results.every((result) => result.body.repay_add?.value === 1700n)).toBe(true);
    expect(await h.totals()).toMatchObject([
      { uid: "owner", type: 1, gold: 1700n, getLv: 2, updateTime: BigInt(h.clock.now) },
    ]);
    const messages = await h.mails();
    expect(messages).toHaveLength(2);
    expect(
      messages.every(
        (row) =>
          row.rewardStatus === 0 &&
          row.rewardId?.includes("goods,200001,2") &&
          row.rewardId?.includes("wood,0,11"),
      ),
    ).toBe(true);
    expect((await h.profile()).gold).toBe(100000n);
    expect(
      (await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_normal_levels")))[0]
        ?.value,
    ).toBe("2");
    const view = fields((await h.command("normal.recharge.init", {})).body.repayinfo);
    expect(view.payPoint).toEqual(sfs.long(1700));
    expect(view.giftType).toEqual(sfs.string("1"));
    expect(view.faceInfo).toEqual(sfs.string("synthetic-face"));
    const thresholds = (view.payRewards!.value as Value[]).map(fields);
    expect(thresholds.map((row) => row.point)).toEqual([sfs.int(500), sfs.int(1700)]);
    expect(thresholds[0]?.important).toEqual(sfs.string("1;2"));
    const claimant = new MailRewardService(
      createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
      h.rules,
    );
    for (const message of messages)
      {await claimant.command("owner", "mail.reward", {
        uid: sfs.string(message.uid),
        operationId: sfs.string(randomUUID()),
      });}
    expect((await h.profile()).gold).toBe(100014n);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]?.wood,
    ).toBe(1000022n);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner")))[0]?.count,
    ).toBe(4);
    await h.db.db
      .delete(mutation_outbox)
      .where(eq(mutation_outbox.requestId, normalRechargeOperation("owner", id, "synthetic")));
    await h.db.db
      .delete(command_receipt)
      .where(
        and(
          eq(command_receipt.ownerUid, "owner"),
          eq(command_receipt.requestId, normalRechargeOperation("owner", id, "synthetic")),
        ),
      );
    await h.paid(id);
    expect(await h.mails()).toHaveLength(2);
    expect((await h.totals())[0]?.gold).toBe(1700n);
    const second = await h.order(randomUUID(), BigInt(h.clock.now - 1000));
    await h.paid(second);
    expect((await h.totals())[0]).toMatchObject({
      gold: 3400n,
      getLv: 2,
      updateTime: BigInt(h.clock.now),
    });
    expect(await h.mails()).toHaveLength(2);
    await expect(h.paid(id, "other")).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("delivery proofs, immutable order markers, rollback and stale realm fencing protect recharge progress", async () => {
  const h = await fixture();
  try {
    const id = await h.order();
    await h.db.db.update(paylog).set({ status: 0 }).where(eq(paylog.orderId, id));
    await expect(h.paid(id)).rejects.toThrow();
    await h.db.db.update(paylog).set({ status: 2 }).where(eq(paylog.orderId, id));
    const proof = h.proofs.get(id)!;
    h.proofs.set(id, { ...proof, priceCents: 4990 });
    await expect(h.paid(id)).rejects.toThrow();
    h.proofs.set(id, { ...proof, rechargeGold: 1701n });
    await expect(h.paid(id)).rejects.toThrow();
    h.proofs.set(id, proof);
    const before = await h.db.db.select().from(mutation_outbox);
    await h.db.pool.query(
      "create function reject_recharge() returns trigger language plpgsql as $$ begin raise exception 'synthetic rollback'; end $$",
    );
    await h.db.pool.query(
      "create trigger reject_recharge before insert on opencok_kingdom.command_receipt for each row execute function reject_recharge()",
    );
    await expect(h.paid(id)).rejects.toThrow();
    expect(await h.totals()).toHaveLength(0);
    expect(await h.mails()).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toEqual(before);
    expect(
      (await h.db.db.select().from(trigger_var)).some((row) =>
        row.key.startsWith("normal.recharge.order."),
      ),
    ).toBe(false);
    await h.db.pool.query("drop trigger reject_recharge on opencok_kingdom.command_receipt");
    await h.paid(id);
    const state = await h.totals();
    await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.paid(await h.order())).rejects.toThrow();
    expect(await h.totals()).toEqual(state);
  } finally {
    await h.close();
  }
}, 120000);
test("actual merge clocks anchor once, postpone overlapping normal windows and cannot create rewards from missing facts", async () => {
  const h = await fixture();
  try {
    for (const merge of [0n, BigInt(h.clock.now + 1000)]) {
      await h.db.db.update(server_info).set({ lastMergeMillis: merge });
      await h.command("normal.recharge.init", {});
      expect((await h.db.db.select().from(server_info))[0]?.mergeTiredRushBeginTime).toBe(0n);
    }
    await h.db.db.update(server_info).set({ lastMergeMillis: BigInt(h.clock.now - 1000) });
    await Promise.all([
      h.command("normal.recharge.init", {}, "owner"),
      h.command("normal.recharge.init", {}, "other"),
    ]);
    const begin = BigInt(Date.UTC(2030, 0, 5));
    expect((await h.db.db.select().from(server_info))[0]?.mergeTiredRushBeginTime).toBe(begin);
    h.clock.now = Number(begin);
    const info = fields((await h.command("normal.recharge.init", {})).body.repayinfo);
    expect(info.giftType).toEqual(sfs.string("4"));
    expect(info.startTime).toEqual(sfs.long(begin));
    await h.paid(await h.order());
    expect((await h.totals())[0]).toMatchObject({ type: 4, getLv: 2, gold: 1700n });
    expect(
      (
        await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, "long_normal_levels"))
      )[0],
    ).toBeUndefined();
    await h.db.db.update(server_info).set({ payTotalTime: 0n });
    expect((await h.command("normal.recharge.init", {})).body.repayinfo).toBeUndefined();
    const id = await h.order();
    await h.paid(id);
    expect((await h.totals())[0]?.gold).toBe(1700n);
    await h.db.db.update(server_info).set({ payTotalTime: 1n });
    await h.db.db
      .delete(mutation_outbox)
      .where(eq(mutation_outbox.requestId, normalRechargeOperation("owner", id, "synthetic")));
    await h.db.db
      .delete(command_receipt)
      .where(eq(command_receipt.requestId, normalRechargeOperation("owner", id, "synthetic")));
    await h.paid(id);
    expect((await h.totals())[0]?.gold).toBe(1700n);
  } finally {
    await h.close();
  }
}, 120000);
