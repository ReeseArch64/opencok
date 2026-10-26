import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { sfs, fields, int, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([anniversaryDomain]);
  h.clock.now = Date.UTC(2024, 8, 15, 12);
  await h.db.db.insert(user_item).values(
    ["212025", "212026", "212027", "212028", "212024"].map((itemId) => ({
      uuid: `owned-${itemId}`,
      ownerId: "owner",
      itemId,
      count: 2,
      value: 0,
    })),
  );
  const quantity = async (itemId: string) =>
    (await h.db.db.select().from(user_item))
      .filter((row) => row.ownerId === "owner" && row.itemId === itemId)
      .reduce((sum, row) => sum + row.count, 0);
  const variable = async (key: string) =>
    (await h.db.db.select().from(trigger_var)).find((row) => row.uid === "owner" && row.key === key)
      ?.value;
  const exchange = (params: Fields = {}) =>
    h.command("trigger.activity", { type: sfs.int(44), para1: sfs.int(6900203), ...params });
  return { ...h, quantity, variable, exchange };
}
test("native campaign recipes consume the four maintained ingredients once and commit their prize and score", async () => {
  const h = await fixture();
  try {
    const request = { operationId: sfs.string(randomUUID()), itemNum: sfs.int(99999) };
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.exchange(request)));
    expect(replies.every((reply) => reply.body.type?.value === 44)).toBe(true);
    for (const item of ["212025", "212026", "212027", "212028"])
      expect(await h.quantity(item)).toBe(1);
    expect(await h.quantity("212078")).toBe(1);
    expect(await h.variable("long_3th_avviversary_paint_abcd_count")).toBe("1");
    expect(await h.variable("long_3th_week1_score_count")).toBe("550");
    expect(
      replies[0]!.pushes
        .filter((push) => push.command === "push.server.action")
        .map((push) => int(push.body, "type")),
    ).toEqual([12, 13]);
    const reward = fields(
      replies[0]!.pushes.find((push) => push.command === "push.server.action")!.body.params,
    );
    expect(reward.reward_list?.value).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("wrong recipe selectors, missing owned ingredients and historical boundaries cannot create unearned score", async () => {
  const h = await fixture();
  try {
    await expect(h.exchange({ para1: sfs.int(1) })).rejects.toThrow();
    expect(await h.variable("long_3th_week1_score_count")).toBeUndefined();
    expect(await h.quantity("212025")).toBe(2);
    await h.db.db.update(user_item).set({ count: 0 }).where(eq(user_item.itemId, "212028"));
    expect((await h.exchange()).body.type).toEqual(sfs.int(44));
    expect(await h.quantity("212025")).toBe(2);
    expect(await h.quantity("212078")).toBe(0);
    h.clock.now = Date.UTC(2024, 8, 20);
    await h.db.db.update(user_item).set({ count: 2 }).where(eq(user_item.itemId, "212028"));
    await h.exchange();
    expect(await h.quantity("212025")).toBe(2);
    expect(await h.quantity("212078")).toBe(0);
    await h.command("trigger.activity", {
      type: sfs.int(54),
      itemId: sfs.string("212025"),
      count: sfs.int(999999),
    });
    expect(await h.variable("long_3th_week1_score_count")).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("recipe receipt failure restores ingredients, rewards, campaign counters and notifications", async () => {
  const h = await fixture();
  try {
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_recipe_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_recipe_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_recipe_receipt()`,
    );
    await expect(h.exchange()).rejects.toThrow();
    for (const item of ["212025", "212026", "212027", "212028"])
      expect(await h.quantity(item)).toBe(2);
    expect(await h.quantity("212078")).toBe(0);
    expect(await h.variable("long_3th_avviversary_paint_abcd_count")).toBeUndefined();
    await h.db.db.execute(
      sql`DROP TRIGGER reject_recipe_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.exchange();
    expect(await h.quantity("212078")).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("owned cake interaction persists overlap counters and installs the exact-count milestone once", async () => {
  const h = await fixture();
  try {
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    const request = {
      type: sfs.int(45),
      uid: sfs.string("owner"),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 3 }, () => h.command("trigger.activity", request)));
    expect(await h.quantity("212024")).toBe(1);
    const states = await h.db.db.select().from(user_state);
    expect(states.find((row) => row.stateId === 509877)).toMatchObject({
      count: 1,
      endTime: BigInt(Date.UTC(2024, 8, 19, 12)),
    });
    await h.db.db.update(user_state).set({ count: 49 }).where(eq(user_state.stateId, 509877));
    await h.command("trigger.activity", { type: sfs.int(45), uid: sfs.string("owner") });
    expect(
      (await h.db.db.select().from(user_state)).find((row) => row.stateId === 509877)!.count,
    ).toBe(50);
    expect((await h.db.db.select().from(user_state)).some((row) => row.stateId === 509878)).toBe(
      true,
    );
    expect(await h.variable("long_3th_anniversary_use_cake_total_count")).toBe("2");
    expect(
      (await h.command("trigger.activity", { type: sfs.int(45), uid: sfs.string("") })).body.type,
    ).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
