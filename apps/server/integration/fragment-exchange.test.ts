import { continued_cost_fact } from "@opencok/drizzle/schema/opencok_kingdom/continued_cost_fact";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createFragmentExchangeDomain } from "@opencok/services/fragment-exchange";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { continuedCostDomain } from "@opencok/services/continued-cost";
import { readFragmentExchangeOffers } from "@opencok/rules/fragment-exchange";
import { exchange_activity } from "@opencok/drizzle/schema/opencok_kingdom/exchange_activity";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { sfs, fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  let calls = 0;
  const h = await cityHarness([
    anniversaryDomain,
    continuedCostDomain,
    createFragmentExchangeDomain(() => {
      calls++;
      return 0;
    }),
  ]);
  h.clock.now = Date.UTC(2024, 8, 15, 12);
  h.rules.power.activityPanels!.set("57006", {
    ...h.rules.power.activityPanels!.get("57006")!,
    function_on: "1",
  });
  const command = (name: string, params = {}, id = randomUUID(), owner = "owner") =>
    h.command(name, { ...params, operationId: sfs.string(id) }, owner);
  const saved = async (owner = "owner") =>
    (await h.db.db.select().from(exchange_activity).where(eq(exchange_activity.uid, owner)))[0]!;
  return {
    ...h,
    command,
    saved,
    calls: () => calls,
    info: (id = randomUUID(), owner = "owner") =>
      command("act.exchange", { ids: sfs.string("57006") }, id, owner),
    reward: (type = 3, id = randomUUID()) =>
      command("act.ex.reward", { id: sfs.string("57006"), type: sfs.int(type) }, id),
    flush: (id = randomUUID()) => command("act.ex.flush", { actId: sfs.string("57006") }, id),
    offers: async () => readFragmentExchangeOffers((await saved()).reward!),
    fund: async (count = 40) => {
      for (const itemId of ["209699", "209700", "209701", "209702", "209703", "209704"])
        {await h.db.db
          .insert(user_item)
          .values({ uuid: `fragment-${itemId}`, ownerId: "owner", itemId, count, value: 0 });}
    },
    counter: async (key: string) =>
      (await h.db.db.select().from(trigger_var).where(eq(trigger_var.uid, "owner"))).find(
        (row) => row.key === key,
      )?.value,
    gold: async () =>
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
  };
}
test("maintained fragment offers persist native duplicate recipes, previews and one owned draw across repeated reads", async () => {
  const h = await fixture();
  try {
    const first = await h.info(),
      saved = await h.saved();
    expect(first.body.exchange!.value as Value[]).toHaveLength(1);
    const view = fields((first.body.exchange!.value as Value[])[0]);
    expect(view.actId).toEqual(sfs.string("57006"));
    expect(view.freeNum).toEqual(sfs.int(2));
    expect(view.refreshCost).toEqual(sfs.int(50));
    expect((await h.offers()).map((offer) => offer.type)).toEqual([6, 4, 3]);
    const next = await h.info();
    expect(next.body.exchange).toEqual(first.body.exchange);
    expect(await h.saved()).toEqual(saved);

    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    await h.info(randomUUID(), "other");
    expect(await h.db.db.select().from(exchange_activity)).toHaveLength(2);
  } finally {
    await h.close();
  }
}, 120000);
test("a real fragment exchange consumes its saved recipe, grants the pinned result and scores only committed exchanges", async () => {
  const h = await fixture();
  try {
    await h.info();
    await h.fund();
    const id = randomUUID(),
      first = await h.reward(3, id),
      offers = await h.offers();
    expect(first.body.actId).toEqual(sfs.string("57006"));
    expect(first.body.reward?.type).toBe(17);
    expect(await h.counter("long_3th_week2_score_count")).toBe("30");
    expect(await h.counter("long_3th_anniversary_dragon_exchange_count")).toBe("2");
    const items = await h.db.db.select().from(user_item);
    expect(
      items
        .filter((row) =>
          ["fragment-209699", "fragment-209700", "fragment-209701"].includes(row.uuid),
        )
        .map((row) => row.count),
    ).toEqual([39, 39, 39]);
    expect(await h.reward(3, id)).toEqual(first);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(await h.offers()).toEqual(offers);
    const maximum = Number(
      h.rules.advanced.campaignVariables!.get("S$long_3th_anniversary_dragon_exchange_count_max")!
        .initialValue,
    );
    for (let index = 0; index < maximum + 1; index++) {await h.reward();}
    expect(await h.counter("long_3th_anniversary_dragon_exchange_count")).toBe(String(maximum));
    const initial = Number(
      h.rules.advanced.campaignVariables!.get("P$long_3th_anniversary_dragon_exchange_count")!
        .initialValue,
    );
    expect(await h.counter("long_3th_week2_score_count")).toBe(String((maximum - initial) * 30));
  } finally {
    await h.close();
  }
}, 120000);
test("fragment refresh uses two daily free draws, charges only confirmed later refreshes and resets the budget at UTC midnight", async () => {
  const h = await fixture();
  try {
    h.rules.features.set("continued_cost", {
      id: "continued_cost",
      online: "all",
      test: "all",
      version: "1.0.0",
    });
    h.rules.items.set("continued_cost", {
      ...h.rules.items.get("continued_cost")!,
      k1: "1",
      k2: "1",
    });
    h.rules.power.activityPanels!.set("57159", {
      ...h.rules.power.activityPanels!.get("57159")!,
      start: "2024-09-13-00-00",
      end: "2024-09-20-00-00",
    });
    await h.info();
    await h.flush();
    await h.flush();
    expect(await h.gold()).toBe(100000n);
    const id = randomUUID(),
      paid = await h.flush(id);
    expect(paid.body.gold).toEqual(sfs.long(99950n));
    expect(fields(paid.body.flush).actId).toBeUndefined();
    expect(await h.flush(id)).toEqual(paid);
    expect(await h.gold()).toBe(99950n);
    expect((await h.saved()).refresh).toBe(3);
    const facts = await h.db.db.select().from(continued_cost_fact);
    expect(facts).toHaveLength(1);
    expect(facts[0]?.amount).toBe(50n);
    h.clock.now = Date.UTC(2024, 8, 16);
    await h.flush();
    expect((await h.saved()).refresh).toBe(1);
    expect(await h.gold()).toBe(99950n);
  } finally {
    await h.close();
  }
}, 120000);
test("missing ingredients, unknown tiers, disabled panels and absent offers cannot create rewards or campaign progress", async () => {
  const h = await fixture();
  try {
    await expect(h.reward()).rejects.toThrow();
    await h.info();
    const saved = await h.saved();
    await expect(h.reward()).rejects.toThrow();
    await expect(h.reward(2)).rejects.toThrow();
    await h.fund();
    h.rules.power.activityPanels!.set("57006", {
      ...h.rules.power.activityPanels!.get("57006")!,
      function_on: "0",
    });
    await expect(h.reward()).rejects.toThrow();
    await expect(h.flush()).rejects.toThrow();
    expect((await h.info()).body.exchange).toEqual(sfs.array([]));
    expect(await h.saved()).toEqual(saved);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("receipt failure rolls back ingredient debit, grant, replaced offer and campaign score before the same operation retries", async () => {
  const h = await fixture();
  try {
    await h.info();
    await h.fund();
    const before = await h.saved(),
      items = await h.db.db.select().from(user_item);
    await h.db.pool.query(
      `create function reject_fragment_receipt() returns trigger language plpgsql as $$ begin if new.command='act.ex.reward' then raise exception 'synthetic fragment receipt failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_fragment_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_fragment_receipt()`,
    );
    const id = randomUUID();
    await expect(h.reward(3, id)).rejects.toThrow();
    expect(await h.saved()).toEqual(before);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
    await h.db.pool.query(
      `drop trigger reject_fragment_receipt on opencok_kingdom.command_receipt`,
    );
    await h.reward(3, id);
    expect(await h.counter("long_3th_week2_score_count")).toBe("30");
  } finally {
    await h.close();
  }
}, 120000);
test("a saved repeated-fragment recipe consumes every copy and grants its stored fourteenfold reward exactly once", async () => {
  const h = await fixture();
  try {
    await h.info();
    await h.fund();
    const offers = await h.offers(),
      repeated = {
        id: Array.from({ length: 6 }, () => "209699"),
        type: 6,
        same: 6,
        reward: "247012",
        multiple: 14,
      };
    await h.db.db
      .update(exchange_activity)
      .set({
        reward: Buffer.from(
          JSON.stringify(offers.map((offer) => (offer.type === 6 ? repeated : offer))),
        ),
      })
      .where(eq(exchange_activity.uid, "owner"));
    const id = randomUUID(),
      result = await h.reward(6, id),
      items = await h.db.db.select().from(user_item);
    expect(items.find((row) => row.itemId === "200300")?.count).toBe(14);
    expect(items.find((row) => row.uuid === "fragment-209699")?.count).toBe(34);
    expect(fields(fields((result.body.reward!.value as Value[])[0]).value).rewardAdd).toEqual(
      sfs.int(14),
    );
    await h.reward(6, id);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect((await h.offers()).find((offer) => offer.type === 6)?.same).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("legacy UTF-8 padded offer blobs remain readable while malformed saved repetition proofs are preserved without granting", async () => {
  const h = await fixture();
  try {
    await h.info();
    const offers = await h.offers(),
      bytes = Buffer.from(JSON.stringify(offers) + "\0\0");
    await h.db.db
      .update(exchange_activity)
      .set({ reward: bytes })
      .where(eq(exchange_activity.uid, "owner"));
    await h.info();
    expect((await h.saved()).reward).toEqual(bytes);
    const invalid = Buffer.from(JSON.stringify(offers.map((offer) => ({ ...offer, same: 6 }))));
    await h.db.db
      .update(exchange_activity)
      .set({ reward: invalid })
      .where(eq(exchange_activity.uid, "owner"));
    await expect(h.info()).rejects.toThrow();
    await expect(h.reward()).rejects.toThrow();
    expect((await h.saved()).reward).toEqual(invalid);
    expect(await h.db.db.select().from(user_item)).toHaveLength(0);
    expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("a failed paid refresh receipt preserves gold, free-budget consumption and the previous pinned offers before retry", async () => {
  const h = await fixture();
  try {
    await h.info();
    await h.flush();
    await h.flush();
    const before = await h.saved();
    await h.db.pool.query(
      `create function reject_fragment_refresh() returns trigger language plpgsql as $$ begin if new.command='act.ex.flush' then raise exception 'synthetic fragment refresh failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_fragment_refresh before insert on opencok_kingdom.command_receipt for each row execute function reject_fragment_refresh()`,
    );
    const id = randomUUID();
    await expect(h.flush(id)).rejects.toThrow();
    expect(await h.saved()).toEqual(before);
    expect(await h.gold()).toBe(100000n);
    await h.db.pool.query(
      `drop trigger reject_fragment_refresh on opencok_kingdom.command_receipt`,
    );
    await h.flush(id);
    expect(await h.gold()).toBe(99950n);
    expect((await h.saved()).refresh).toBe(3);
    const calls = h.calls();
    await h.flush(id);
    expect(h.calls()).toBe(calls);
  } finally {
    await h.close();
  }
}, 120000);
