import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createOrdinaryBoxDomain } from "@opencok/services/ordinary-box";
import { InventoryService } from "@opencok/services/inventory";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { boxWords, boxWord, boxCounter } from "@opencok/rules/ordinary-box";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { sfs, encode, decode, fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture() {
  let draws = 0;
  const h = await cityHarness([
    createOrdinaryBoxDomain(() => {
      draws++;
      return 0;
    }),
  ]);
  h.rules.advanced.ordinaryBoxes!.clear();
  h.rules.advanced.ordinaryBoxes!.set("990001", {
    id: "990001",
    type: "2",
    condition: "1;1",
    cond_rate: "1",
    rate: "1",
    rate_luckyday: "1",
    pay_reward: "990100",
    special_reward: "1",
  });
  h.rules.advanced.payRewards!.set("990100", {
    id: "990100",
    item: "200200",
    num: "1",
    rate: "100",
    circle: "1",
  });
  h.rules.reconnect.rewards!.set("990020", { id: "990020", gold: "7" });
  h.rules.goods.set("210920", {
    id: "210920",
    type: "36",
    para1: "2",
    para2: "2",
    para3: "990020",
    para4: "210921",
    para5: "10",
  });
  h.rules.features.set("box_ordinary_money", {
    id: "box_ordinary_money",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  const words = Array<number>(128).fill(0);
  words[0] = -1;
  words[127] = -2147483648;
  await h.db.db
    .insert(user_mixed_info)
    .values({ uid: "owner", mdata: words.join(",") + ",", materialBackup: 7 });
  await h.db.db.insert(user_item).values([
    { uuid: "boxes", ownerId: "owner", itemId: "210920", count: 3, value: 0 },
    { uuid: "keys", ownerId: "owner", itemId: "210921", count: 2, value: 0 },
  ]);
  const inventory = new InventoryService(
    createInventoryExecutor(h.db.db, h.authority, () => h.clock.now, {
      before: async (tx, owner, now) => {
        await h.preparation.prepare(tx, owner, now);
      },
      useEffect: async (tx, owner, itemId, count, now, economy) =>
        decode(
          Buffer.from(
            (
              await h.handlers.command(
                tx,
                owner,
                "ordinary.box.open",
                encode({ itemId: sfs.string(itemId), count: sfs.int(count) }),
                now,
                economy,
              )
            ).response,
          ),
        ),
    }),
    h.rules,
    h.effects,
  );
  const saved = async () =>
    (await h.db.db.select().from(user_mixed_info).where(eq(user_mixed_info.uid, "owner")))[0]!;
  const gold = async () =>
    (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold;
  const quantity = async (itemId: string) =>
    (await h.db.db.select().from(user_item).where(eq(user_item.itemId, itemId))).reduce(
      (sum, item) => sum + item.count,
      0,
    );
  const preview = () =>
    h.command("get.table.value", { type: sfs.int(1), params: sfs.string("210920") });
  const open = (operationId = sfs.string(randomUUID())) =>
    inventory.command("owner", "item.use", {
      uuid: sfs.string("boxes"),
      num: sfs.int(1),
      operationId,
    });
  return { ...h, saved, gold, quantity, preview, open, draws: () => draws };
}
test("box previews pin one pool and key openings commit inventory, rewards and guarantee counters once", async () => {
  const h = await fixture();
  try {
    const baseline = await h.gold(),
      preview = fields((await h.preview()).body.params);
    expect(preview.special).toEqual(sfs.int(1));
    expect(preview.baodi_num).toEqual(sfs.int(0));
    expect(preview.reward_info!.value as unknown[]).toHaveLength(1);
    expect(h.draws()).toBe(2);
    await h.preview();
    expect(h.draws()).toBe(2);
    expect(await h.quantity("210920")).toBe(3);
    expect(await h.gold()).toBe(baseline);
    const operationId = sfs.string(randomUUID());
    await Promise.all(Array.from({ length: 4 }, () => h.open(operationId)));
    expect(await h.quantity("210920")).toBe(2);
    expect(await h.quantity("210921")).toBe(1);
    expect(await h.quantity("200200")).toBe(1);
    expect(boxCounter(boxWords((await h.saved()).mdata), 2)).toBe(1);
    expect(h.draws()).toBe(4);
    await h.open();
    expect(await h.quantity("210920")).toBe(1);
    expect(await h.quantity("210921")).toBe(0);
    expect(await h.quantity("200200")).toBe(2);
    expect(await h.gold()).toBe(baseline + 7n);
    const row = await h.saved(),
      words = boxWords(row.mdata);
    expect(boxCounter(words, 2)).toBe(0);
    expect(boxWord(words, 2, 1, 31)).toBe(990100);
    expect(words[0]).toBe(-1);
    expect(words[127]).toBe(-2147483648);
    expect(row.materialBackup).toBe(7);
  } finally {
    await h.close();
  }
}, 120000);
test("gold mode is feature gated, reset on login or preview and cannot turn a native query into a grant", async () => {
  const h = await fixture();
  try {
    await h.preview();
    await h.command("get.table.value", { type: sfs.int(2), params: sfs.string("true") });
    expect((await h.saved()).ordinaryBoxGold).toBe(1);
    const baseline = await h.gold();
    const forged = await h.command("get.table.value", {
      type: sfs.int(0),
      itemId: sfs.string("210920"),
      count: sfs.int(1),
    });
    expect(forged.body.reward).toBeUndefined();
    expect(await h.quantity("210920")).toBe(3);
    expect(await h.gold()).toBe(baseline);
    await h.open();
    expect(await h.gold()).toBe(baseline - 10n);
    expect(await h.quantity("210921")).toBe(2);
    expect(await h.quantity("210920")).toBe(2);
    await h.command("ordinary.box.init", {});
    expect((await h.saved()).ordinaryBoxGold).toBe(0);
    await h.command("get.table.value", { type: sfs.int(2), params: sfs.string("true") });
    await h.preview();
    expect((await h.saved()).ordinaryBoxGold).toBe(0);
    h.rules.features.get("box_ordinary_money")!.online = "close";
    const disabled = await h.command("get.table.value", {
      type: sfs.int(2),
      params: sfs.string("true"),
    });
    expect(disabled.body.state).toEqual(sfs.bool(false));
    await expect(
      h.command("ordinary.box.open", { itemId: sfs.string("210920"), count: sfs.int(2) }),
    ).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("failed box commits restore cached pools, guarantees, keys, boxes and reward balances", async () => {
  const h = await fixture();
  try {
    await h.preview();
    const original = (await h.saved()).mdata;
    await h.db.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_box_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
    );
    await h.db.db.execute(
      sql`CREATE TRIGGER reject_box_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_box_receipt()`,
    );
    await expect(h.open()).rejects.toThrow();
    expect((await h.saved()).mdata).toBe(original);
    expect(await h.quantity("210920")).toBe(3);
    expect(await h.quantity("210921")).toBe(2);
    expect(await h.quantity("200200")).toBe(0);
    await h.db.db.execute(sql`DROP TRIGGER reject_box_receipt ON opencok_kingdom.command_receipt`);
    await h.open();
    expect(await h.quantity("210920")).toBe(2);
    expect(await h.quantity("210921")).toBe(1);
    await h.db.db.update(user_item).set({ count: 0 }).where(eq(user_item.uuid, "keys"));
    await expect(h.open()).rejects.toThrow();
    expect(await h.quantity("210920")).toBe(2);
    expect(boxCounter(boxWords((await h.saved()).mdata), 2)).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
