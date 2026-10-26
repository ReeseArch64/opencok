import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { continuedCostDomain } from "@opencok/services/continued-cost";
import { ShopService } from "@opencok/services/shops";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createShopRepository } from "@opencok/repositories/shops";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { executeInventoryTransaction } from "@opencok/repositories/inventory";
import {
  campaignInventoryObservations,
  campaignObservationNeeded,
  planCampaignObservation,
} from "@opencok/services/campaign-observation";
import type { CampaignObservation } from "@opencok/contracts/campaign-observation";
import type { MutationTransaction } from "@opencok/repositories/mutation";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { shopping_mall } from "@opencok/drizzle/schema/opencok_kingdom/shopping_mall";
import { shop_stock } from "@opencok/drizzle/schema/opencok_kingdom/shop_stock";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { continued_cost_fact } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([anniversaryDomain, continuedCostDomain]),
    now = () => h.clock.now;
  h.clock.now = Date.UTC(2024, 8, 20, 12);
  const confirmed = async (
    tx: MutationTransaction,
    owner: string,
    events: readonly CampaignObservation[],
    at: number,
  ) => {
    if (!campaignObservationNeeded(h.rules, events, at)) return undefined;
    return executeInventoryTransaction(
      tx,
      owner,
      (state) =>
        planCampaignObservation(state, h.rules, h.effects, at, events, (request, economy) =>
          h.handlers.command(tx, owner, "campaign.record", request, BigInt(at), economy),
        ),
      "campaign.record",
    );
  };
  const shops = new ShopService(
      createShopRepository(h.db.db, h.authority, now, (tx, owner, purchase, inventory, at) =>
        confirmed(
          tx,
          owner,
          campaignInventoryObservations(inventory, {
            code: 68,
            selector: purchase.saleType!,
            attributes: {
              key_shopId: purchase.id,
              key_shopBuyNum: purchase.count,
              key_shopSaleType: purchase.saleType!,
            },
          }),
          at,
        ),
      ),
      h.rules,
    ),
    claims = new MailRewardService(
      createMailRewardExecutor(
        h.db.db,
        h.authority,
        now,
        async () => true,
        (tx, owner, entry, inventory, at) =>
          confirmed(
            tx,
            owner,
            campaignInventoryObservations(inventory, {
              code: 61,
              selector: String(entry.title ?? ""),
              attributes: { key_mailTitle: String(entry.title ?? "") },
            }),
            at,
          ),
      ),
      h.rules,
    );
  return {
    ...h,
    shops,
    claims,
    buy: (count = 1, id = randomUUID()) =>
      shops.command("owner", "shoppingMall.buy", {
        id: sfs.string("1000152"),
        num: sfs.int(count),
        operationId: sfs.string(id),
      }),
    claim: (uid: string, id = randomUUID(), owner = "owner") =>
      claims.command(owner, "mail.reward", { uid: sfs.string(uid), operationId: sfs.string(id) }),
    counter: async (key: string) =>
      (await h.db.db.select().from(trigger_var).where(eq(trigger_var.key, key)))[0]?.value,
  };
}
function cost(h: Awaited<ReturnType<typeof fixture>>, type = 1) {
  h.rules.features.set("continued_cost", {
    id: "continued_cost",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  h.rules.items.set("continued_cost", {
    ...h.rules.items.get("continued_cost")!,
    k1: "1",
    k2: String(type),
  });
  h.rules.power.activityPanels!.set("57159", {
    ...h.rules.power.activityPanels!.get("57159")!,
    start: "2024-09-19-00-00",
    end: "2024-09-27-00-00",
  });
}
test("confirmed native shop purchases score their real item quantities and one capped purchase event without counting previews or retry", async () => {
  const h = await fixture();
  try {
    cost(h);
    await h.shops.command("owner", "mall.info", {});
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    const id = randomUUID();
    await h.buy(3, id);
    const items = await h.db.db.select().from(user_item);
    await h.buy(3, id);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(await h.counter("long_3th_anniversary_fire_buy_time_count")).toBe("1");
    const maximum = Number(
      h.rules.advanced.campaignVariables!.get("S$long_3th_anniversary_get_fire_count_max")!
        .initialValue,
    );
    expect(await h.counter("long_3th_anniversary_get_fire_count")).toBe(
      String(Math.min(3, maximum)),
    );
    expect(await h.counter("long_3th_week3_score_count")).toBe(String(150 + Math.min(3, maximum)));
    expect((await h.db.db.select().from(continued_cost_fact))[0]?.amount).toBe(150n);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(99850n);
    await h.buy();
    expect(await h.counter("long_3th_anniversary_fire_buy_time_count")).toBe("1");
    expect((await h.db.db.select().from(shopping_mall))[0]?.buyTotal).toBe(4);
  } finally {
    await h.close();
  }
}, 120000);
test("a failed campaign observer rolls back shop debit, delivery, counters, stock, facts and its receipt", async () => {
  const h = await fixture();
  try {
    cost(h);
    await h.db.pool.query(
      `create function reject_shop_campaign() returns trigger language plpgsql as $$ begin raise exception 'synthetic campaign failure'; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_shop_campaign before insert on opencok_kingdom.trigger_var for each row execute function reject_shop_campaign()`,
    );
    const id = randomUUID();
    await expect(h.buy(1, id)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(100000n);
    for (const table of [
      user_item,
      shopping_mall,
      shop_stock,
      continued_cost_fact,
      economy_posting,
      mutation_outbox,
    ])
      expect(await h.db.db.select().from(table)).toHaveLength(0);
    await h.db.pool.query(`drop trigger reject_shop_campaign on opencok_kingdom.trigger_var`);
    await h.buy(1, id);
    expect(await h.counter("long_3th_anniversary_fire_buy_time_count")).toBe("1");
  } finally {
    await h.close();
  }
}, 120000);
test("receipt failure after a confirmed purchase restores campaign progress before the same operation retries", async () => {
  const h = await fixture();
  try {
    await h.db.pool.query(
      `create function reject_shop_receipt() returns trigger language plpgsql as $$ begin if new.command='shoppingMall.buy' then raise exception 'synthetic receipt failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_shop_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_shop_receipt()`,
    );
    const id = randomUUID();
    await expect(h.buy(1, id)).rejects.toThrow();
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    await h.db.pool.query(`drop trigger reject_shop_receipt on opencok_kingdom.command_receipt`);
    await h.buy(1, id);
    expect(await h.counter("long_3th_anniversary_fire_buy_time_count")).toBe("1");
  } finally {
    await h.close();
  }
}, 120000);
test("funded mail claims observe only delivered items and their saved title, preserve bonus pushes and never repeat progress", async () => {
  const h = await fixture();
  try {
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    h.rules.advanced.campaignRules = [
      ...h.rules.advanced.campaignRules!,
      {
        id: "synthetic-mail-gain",
        state: 2,
        openType: 2,
        events: [{ code: 40, parameters: "200300" }],
        conditions: [],
        actions: [
          { code: 9, parameters: "$3th_week1_score_count;+;$key_itemNum" },
          { code: 48, parameters: "250156" },
        ],
      },
    ];
    await h.db.db.insert(mail).values({
      uid: "source-gift",
      toUser: "owner",
      title: "152625",
      type: 2,
      rewardId: "goods,200300,2",
      rewardStatus: 0,
      contents: Buffer.from("synthetic"),
      createTime: BigInt(h.clock.now),
    });
    const response = await h.claim("source-gift");
    expect(await h.counter("long_3th_anniversary_mail_recived_count")).toBe("1");
    expect(await h.counter("long_3th_week1_score_count")).toBe("152");
    expect(response.pushes.some((push) => push.command === "push.server.action")).toBe(true);
    const items = await h.db.db.select().from(user_item);
    await h.claim("source-gift");
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(await h.counter("long_3th_week1_score_count")).toBe("152");
  } finally {
    await h.close();
  }
}, 120000);
test("a failed funded-mail receipt restores its grant, claim marker and campaign progress before retry", async () => {
  const h = await fixture();
  try {
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    await h.db.db.insert(mail).values({
      uid: "rollback-gift",
      toUser: "owner",
      title: "152625",
      type: 2,
      rewardId: "goods,200300,2",
      rewardStatus: 0,
      contents: Buffer.from("synthetic"),
      createTime: BigInt(h.clock.now),
    });
    await h.db.pool.query(
      `create function reject_campaign_claim() returns trigger language plpgsql as $$ begin if new.command='mail.reward.claim' then raise exception 'synthetic claim failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_campaign_claim before insert on opencok_kingdom.command_receipt for each row execute function reject_campaign_claim()`,
    );
    const id = randomUUID();
    await expect(h.claim("rollback-gift", id)).rejects.toThrow();
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    expect((await h.db.db.select().from(mail))[0]?.rewardStatus).toBe(0);
    await h.db.pool.query(`drop trigger reject_campaign_claim on opencok_kingdom.command_receipt`);
    await h.claim("rollback-gift", id);
    expect(await h.counter("long_3th_anniversary_mail_recived_count")).toBe("1");
  } finally {
    await h.close();
  }
}, 120000);
test("chained confirmed speed-item debits retain one complete consumption fact and a continuous owned ledger", async () => {
  const h = await fixture();
  try {
    cost(h, 2);
    h.rules.advanced.continuedCosts = new Map(
      [...h.rules.advanced.continuedCosts!].map(([id, rule]) => [id, { ...rule, type: "2" }]),
    );
    const speed = [...h.rules.goods.values()].find((rule) => rule.type === "2")!.id!;
    await h.db.db.insert(user_item).values({
      uuid: "owned-speed",
      ownerId: "owner",
      itemId: speed,
      count: 3,
      value: 0,
      vanishTime: 0n,
    });
    h.rules.shops.set("1000152", {
      ...h.rules.shops.get("1000152")!,
      value_item: speed,
      value_item_num: "1",
    });
    h.rules.advanced.campaignRules = [
      {
        id: "synthetic-speed-confirmation",
        state: 2,
        openType: 2,
        events: [{ code: 40, parameters: "212033" }],
        conditions: [{ code: 73, parameters: `${speed};1` }],
        actions: [{ code: 9, parameters: "$kingwar_testitem_sent_2;+;1" }],
      },
    ];
    await h.buy();
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "owned-speed")))[0]?.count,
    ).toBe(1);
    const facts = await h.db.db.select().from(continued_cost_fact);
    expect(facts).toHaveLength(1);
    expect(facts[0]?.amount).toBe(2n);
    expect(await h.counter("long_kingwar_testitem_sent_2")).toBe("1");
    expect(
      (await h.db.db.select().from(economy_posting))
        .filter((row) => row.asset === "item.owned-speed")
        .map((row) => [row.before, row.after]),
    ).toEqual([
      [3n, 2n],
      [2n, 1n],
    ]);
  } finally {
    await h.close();
  }
}, 120000);
test("a foreign mail claim and an expired campaign cannot create points while legitimate delivery remains available", async () => {
  const h = await fixture();
  try {
    h.clock.now = Date.UTC(2024, 8, 28, 12);
    await h.buy();
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    await h.db.db.insert(mail).values({
      uid: "private-gift",
      toUser: "owner",
      title: "152625",
      type: 2,
      rewardId: "goods,200300,2",
      rewardStatus: 0,
      contents: Buffer.from("synthetic"),
      createTime: BigInt(h.clock.now),
    });
    await expect(h.claim("private-gift", randomUUID(), "other")).rejects.toThrow();
    expect((await h.db.db.select().from(mail))[0]?.rewardStatus).toBe(0);
    await h.claim("private-gift");
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    expect((await h.db.db.select().from(mail))[0]?.rewardStatus).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("batch mail claims retain campaign pushes and roll back every earlier claim when a later receipt fails", async () => {
  const h = await fixture();
  try {
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    h.rules.advanced.campaignRules = [
      ...h.rules.advanced.campaignRules!,
      {
        id: "synthetic-batch-gain",
        state: 2,
        openType: 2,
        events: [{ code: 40, parameters: "200300" }],
        conditions: [],
        actions: [
          { code: 9, parameters: "$3th_week1_score_count;+;$key_itemNum" },
          { code: 48, parameters: "250156" },
        ],
      },
    ];
    for (const uid of ["batch-a", "batch-b"])
      await h.db.db.insert(mail).values({
        uid,
        toUser: "owner",
        title: "152625",
        type: 2,
        rewardId: "goods,200300,2",
        rewardStatus: 0,
        contents: Buffer.from("synthetic"),
        createTime: BigInt(h.clock.now),
      });
    await h.db.pool.query(
      `create function reject_second_campaign_claim() returns trigger language plpgsql as $$ begin if new.command='mail.reward.claim' and new."requestId"='mail-claim:batch-b' then raise exception 'synthetic second claim failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_second_campaign_claim before insert on opencok_kingdom.command_receipt for each row execute function reject_second_campaign_claim()`,
    );
    const id = randomUUID(),
      batch = () =>
        h.claims.command("owner", "mail.reward.batch", {
          uids: sfs.string("batch-a,batch-b"),
          operationId: sfs.string(id),
        });
    await expect(batch()).rejects.toThrow();
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    expect((await h.db.db.select().from(mail)).map((row) => row.rewardStatus)).toEqual([0, 0]);
    await h.db.pool.query(
      `drop trigger reject_second_campaign_claim on opencok_kingdom.command_receipt`,
    );
    const result = await batch();
    expect(await h.counter("long_3th_anniversary_mail_recived_count")).toBe("1");
    expect(await h.counter("long_3th_week1_score_count")).toBe("154");
    expect(result.pushes.filter((push) => push.command === "push.server.action")).toHaveLength(2);
    const items = await h.db.db.select().from(user_item);
    expect(await batch()).toEqual(result);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
  } finally {
    await h.close();
  }
}, 120000);
