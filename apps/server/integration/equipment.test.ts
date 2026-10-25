import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { equipmentDomain, workshopDomain } from "@opencok/services/equipment";
import { InventoryService } from "@opencok/services/inventory";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";

test("equipment crafting pins results, consumes once, completes, equips, and dismantles durably", async () => {
  const h = await cityHarness([equipmentDomain, workshopDomain]);
  try {
    await h.db.db
      .insert(user_building)
      .values({ uid: "owner", uuid: "forge", itemId: 429000, level: 1, pos: 12 });
    const inventory = new InventoryService(
      createInventoryExecutor(h.db.db, h.authority, () => h.clock.now),
      h.rules,
      h.effects,
      () => h.clock.now,
    );
    for (const id of ["201060", "201070"]) await inventory.grant("owner", randomUUID(), id, 2);
    const request = {
      itemId: sfs.string("1001010"),
      tools: sfs.array([sfs.int(201060), sfs.int(201070)]),
      operationId: sfs.string(randomUUID()),
    };
    await h.command("equipment.create", request);
    const active = await h.active(11);
    const [pending] = await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner"));
    expect(pending?.on).toBe(2);
    expect(pending?.uuid).toBe(active.itemId);
    await h.command("equipment.create", request);
    expect(await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner"))).toHaveLength(
      1,
    );
    await expect(
      h.command("equipment.break", { uuid: sfs.string(pending!.uuid) }),
    ).rejects.toThrow();
    await h.finish(11);
    expect(
      (await h.db.db.select().from(user_equip).where(eq(user_equip.uuid, pending!.uuid)))[0]?.on,
    ).toBe(0);
    await h.command("equip.putOn", { uuid: sfs.string(pending!.uuid) });
    await expect(
      h.command("equipment.break", { uuid: sfs.string(pending!.uuid) }),
    ).rejects.toThrow();
    await h.command("equip.takeOff", { uuid: sfs.string(pending!.uuid) });
    const dismantle = { uuid: sfs.string(pending!.uuid), operationId: sfs.string(randomUUID()) };
    await h.command("equipment.break", dismantle);
    await h.command("equipment.break", dismantle);
    expect(await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner"))).toHaveLength(
      0,
    );
    const items = await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"));
    expect(items.reduce((sum, row) => sum + row.count, 0)).toBe(4);
  } finally {
    await h.close();
  }
}, 60000);

test("workshop chains jobs atomically and recovers overdue work in order", async () => {
  const h = await cityHarness([equipmentDomain, workshopDomain]);
  try {
    await h.db.db.insert(user_mixed_info).values({ uid: "owner", mdata: "", materialBackup: 3 });
    await h.command("create.tool", { itemId: sfs.string("201010") });
    const first = await h.active(12);
    await h.command("create.tool", { itemId: sfs.string("201020") });
    await h.command("create.tool", { itemId: sfs.string("201030") });
    await expect(h.command("create.tool", { itemId: sfs.string("201040") })).rejects.toThrow();
    await h.command("rm.tool", { index: sfs.int(2) });
    await h.finish(12);
    const second = await h.active(12);
    expect(second.id).not.toBe(first.id);
    expect(second.itemId).toBe("201020");
    expect(second.startedAt).toBe(first.dueAt);
    await h.finish(12);
    const items = await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"));
    expect(items.map((row) => row.itemId).sort()).toEqual(["201010", "201020"]);
    const [saved] = await h.db.db.select().from(queue).where(eq(queue.uuid, "owner-q12"));
    expect(saved?.itemId).toBe("");
    await expect(h.command("rm.tool", { index: sfs.int(1) })).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 60000);

test("workshop acceleration uses material prices and rejects the daily limit atomically", async () => {
  const h = await cityHarness([workshopDomain]);
  try {
    const { userprofile } = await import("@opencok/drizzle/schema/opencok_kingdom/userprofile");
    await h.command("create.tool", { itemId: sfs.string("201010") });
    await h.service.command("owner", "queue.ccd", {
      qUUID: sfs.string("owner-q12"),
      isGold: sfs.int(1),
      operationId: sfs.string(randomUUID()),
    });
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(99900n);
    expect(
      (await h.db.db.select().from(user_mixed_info).where(eq(user_mixed_info.uid, "owner")))[0]
        ?.materialCdNum,
    ).toBe(1);
    await h.command("create.tool", { itemId: sfs.string("201010") });
    await h.db.db
      .update(user_mixed_info)
      .set({ materialCdNum: 20, materialCdTime: BigInt(h.clock.now) })
      .where(eq(user_mixed_info.uid, "owner"));
    await expect(
      h.service.command("owner", "queue.ccd", {
        qUUID: sfs.string("owner-q12"),
        isGold: sfs.int(1),
        operationId: sfs.string(randomUUID()),
      }),
    ).rejects.toThrow();
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]?.gold,
    ).toBe(99900n);
    expect((await h.active(12)).status).toBe(0);
  } finally {
    await h.close();
  }
}, 60000);

test("legacy workshop recovery preserves unharvested completed quantities", async () => {
  const h = await cityHarness([workshopDomain]);
  try {
    await h.db.db
      .update(queue)
      .set({
        itemId: "201010;201020;",
        para: 1,
        startTime: BigInt(h.clock.now - 1000),
        updateTime: BigInt(h.clock.now + 7200000),
        totalTime: 7200000n,
      })
      .where(eq(queue.uuid, "owner-q12"));
    await h.service.restore("owner", randomUUID(), "owner-q12");
    await h.finish(12);
    const items = await h.db.db.select().from(user_item).where(eq(user_item.ownerId, "owner"));
    expect(items.map((row) => [row.itemId, row.count]).sort()).toEqual([
      ["201010", 1],
      ["201020", 1],
    ]);
  } finally {
    await h.close();
  }
}, 60000);
