import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { castleLevelEventDomain } from "@opencok/services/castle-level-event";
import { castle_leveling_0 } from "@opencok/drizzle/schema/opencok_kingdom/castle_leveling_0";
import { castle_leveling_1 } from "@opencok/drizzle/schema/opencok_kingdom/castle_leveling_1";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { castle_exchange } from "@opencok/drizzle/schema/opencok_kingdom/castle_exchange";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, fields, Type, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([castleLevelEventDomain]);
  h.rules.configuration.payControl!.set("69024", {
    id: "69024",
    k1: "1.0.0",
    k2: "all",
    k72: "all",
    k107: "all",
  });
  h.rules.advanced.castleLevels!.clear();
  h.rules.advanced.castleLevels!.set("9011501", {
    id: "9011501",
    activity_Type: "1;90|2;90",
    castle_lv: "2",
    lv_reward: "9011001",
    Sharing_condition: "1|2|10|20|30|40|50",
    Shared_reward: "9011012|9011013|9011014|9011015|9011016|9011017|9011018",
    exchange_id: "9014001|9014002",
  });
  await h.db.db.insert(server_info).values({ uid: "server", activityTime: BigInt(h.clock.now) });
  const saved = async () => [
    ...(await h.db.db.select().from(castle_leveling_0).where(eq(castle_leveling_0.uid, "owner"))),
    ...(await h.db.db.select().from(castle_leveling_1).where(eq(castle_leveling_1.uid, "owner"))),
  ];
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  const grow = async () => {
    await h.command("build.upgrade", { uuid: sfs.string("owner-400000"), gold: sfs.int(0) });
    await h.finish(0);
  };
  return { ...h, saved, gold, grow };
}
test("castle construction records only earned levels and retries cannot duplicate personal or shared rewards", async () => {
  const h = await fixture();
  try {
    await expect(h.command("castle.level.reward", { id: sfs.string("9011501") })).rejects.toThrow();
    await h.grow();
    expect(await h.saved()).toHaveLength(1);
    expect((await h.saved())[0]!.lv_reward).toBe(0);
    const baseline = await h.gold(),
      operationId = sfs.string(randomUUID()),
      args = { id: sfs.string("9011501"), operationId };
    const replies = await Promise.all(
      Array.from({ length: 4 }, () => h.command("castle.level.reward", args)),
    );
    expect(replies.every((reply) => reply.body.id!.value === "9011501")).toBe(true);
    expect(await h.gold()).toBe(baseline + 500n);
    expect((await h.saved())[0]!.lv_reward).toBe(9011001);
    await expect(h.command("castle.level.reward", { id: sfs.string("9011501") })).rejects.toThrow();
    const shared = {
      id: sfs.string("9011501"),
      pos: sfs.int(0),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 4 }, () => h.command("castle.share.reward", shared)));
    expect(await h.gold()).toBe(baseline + 800n);
    expect((await h.saved())[0]!.share_reward_0).toBe(9011012);
    await expect(
      h.command("castle.share.reward", { id: sfs.string("9011501"), pos: sfs.int(-1) }),
    ).rejects.toThrow();
    await expect(
      h.command("castle.share.reward", { id: sfs.string("9011501"), pos: sfs.int(7) }),
    ).rejects.toThrow();
    const missed = await h.command("castle.share.reward", {
      id: sfs.string("9011501"),
      pos: sfs.int(1),
    });
    expect(missed.body.reward).toBeUndefined();
    await h.db.db.insert(castle_leveling_0).values({ uid: "other", level: 2 });
    const claimed = await h.command("castle.share.reward", {
      id: sfs.string("9011501"),
      pos: sfs.int(1),
    });
    expect(claimed.body.reward_id).toEqual(sfs.string("9011013"));
  } finally {
    await h.close();
  }
}, 120000);
test("native castle projections reconcile existing shards, realm totals and owned purchases without granting older levels", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .update(user_building)
      .set({ level: 2 })
      .where(eq(user_building.uuid, "owner-400000"));
    await h.db.db.insert(castle_leveling_1).values({ uid: "owner", level: 2, pay_times_0: 3 });
    await h.db.db.insert(castle_leveling_0).values({ uid: "other", level: 2 });
    await h.db.db.insert(castle_exchange).values([
      { uid: "owner", id: "9014001", buy: 1 },
      { uid: "other", id: "9014002", buy: 2 },
    ]);
    const reply = await h.command("castle.ui.state", {}),
      state = fields((reply.body.castleLVState!.value as Value[])[0]);
    expect(state.share_reward!.type).toBe(Type.IntArray);
    expect(state.share_reward!.value).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(state.lvReward).toEqual(sfs.int(0));
    const table = fields((reply.body.castleLVTable!.value as Value[])[0]);
    expect(table.LV_Num).toEqual(sfs.int(2));
    expect(table.castle_lv).toEqual(sfs.string("2"));
    expect(table.lv_reward_arr!.type).toBe(Type.Array);
    expect(reply.body.castleLVPayExchange).toEqual({ type: Type.StringArray, value: ["9014001"] });
    await h.command("castle.level.reward", { id: sfs.string("9011501") });
    expect((await h.saved())[0]!.pay_times_0).toBe(3);
    expect(
      await h.db.db.select().from(castle_leveling_0).where(eq(castle_leveling_0.uid, "owner")),
    ).toHaveLength(0);
    h.rules.advanced.castleLevels!.set("9011500", {
      ...h.rules.advanced.castleLevels!.get("9011501")!,
      id: "9011500",
      castle_lv: "1",
    });
    await h.command("castle.ui.state", {});
    expect(await h.saved()).toHaveLength(1);
    await h.db.db.insert(castle_leveling_0).values({ uid: "owner", level: 2 });
    await expect(h.command("castle.ui.state", {})).rejects.toThrow("Ambiguous");
  } finally {
    await h.close();
  }
}, 120000);
test("login recovery funds one mail atomically and respects the configured realm age", async () => {
  const h = await fixture();
  try {
    await h.grow();
    const baseline = await h.gold();
    await Promise.all(Array.from({ length: 3 }, () => h.command("castle.event.init", {})));
    expect((await h.saved())[0]!.lv_reward).toBe(9011001);
    expect(await h.gold()).toBe(baseline);
    const mails = await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"));
    expect(mails).toHaveLength(1);
    expect(mails[0]!.rewardId).toContain("gold,0,500");
    await h.db.db
      .update(castle_leveling_0)
      .set({ lv_reward: 0 })
      .where(eq(castle_leveling_0.uid, "owner"));
    await h.db.db
      .update(castle_leveling_1)
      .set({ lv_reward: 0 })
      .where(eq(castle_leveling_1.uid, "owner"));
    h.clock.now += 90 * 86400000 + 1;
    await h.command("castle.event.init", {});
    expect((await h.saved())[0]!.lv_reward).toBe(0);
    expect(await h.db.db.select().from(mail).where(eq(mail.toUser, "owner"))).toHaveLength(1);
    h.rules.configuration.payControl!.set("69024", { id: "69024", k1: "1.0.0", k2: "close" });
    expect((await h.command("castle.ui.state", {})).body.castleLVTable).toBeUndefined();
    await expect(h.command("castle.level.reward", { id: sfs.string("9011501") })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("failed castle reward commits roll back balances, items and claim flags together", async () => {
  const h = await fixture();
  try {
    await h.grow();
    const baseline = await h.gold();
    const items = await h.db.db.select().from(user_item);
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_castle_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_castle_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_castle_receipt()`,
    );
    await expect(h.command("castle.level.reward", { id: sfs.string("9011501") })).rejects.toThrow();
    expect(await h.gold()).toBe(baseline);
    expect(await h.db.db.select().from(user_item)).toEqual(items);
    expect((await h.saved())[0]!.lv_reward).toBe(0);
    await h.db.db.execute(
      sql`DROP TRIGGER reject_castle_receipt ON opencok_kingdom.command_receipt`,
    );
    await h.command("castle.level.reward", { id: sfs.string("9011501") });
    expect(await h.gold()).toBe(baseline + 500n);
    expect((await h.saved())[0]!.lv_reward).toBe(9011001);
  } finally {
    await h.close();
  }
}, 120000);
