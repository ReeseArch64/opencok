import { test, expect } from "bun:test";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { createCivilizationCastleDomain } from "@opencok/services/civilization-castle";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

test("civilization castles fence placement, recover elapsed production and settle exactly once", async () => {
  const h = await cityHarness([createCivilizationCastleDomain(1200)]);
  try {
    h.rules.items.set("civilization_fortress", {
      ...h.rules.items.get("civilization_fortress")!,
      k3: "1",
    });
    h.rules.features.set("civilization_fortress_on", {
      id: "civilization_fortress_on",
      online: "all",
      test: "all",
      version: "1.0.0",
    });
    await h.db.db
      .update(userprofile)
      .set({ civilizationSorce: 1000n })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: 1, worldId: 0, color: 1, lastCityDefTime: 0n });
    await h.db.db
      .insert(user_building)
      .values({ uid: "owner", uuid: "civilization-building", itemId: 443000, level: 1, pos: 22 });
    for (const base of [10, 20])
      for (const id of [base, base + 1, base + 1200, base + 1201])
        await h.db.db.insert(worldpoint).values({
          id,
          worldId: 0,
          x: (id - 1) % 1200,
          y: Math.floor((id - 1) / 1200),
          areaId: 0,
          gridType: 2,
          grid2Type: 0,
          pointType: 0,
          resLevel: 0,
          resInitValue: 0,
        });
    const command = (action: string, params: Fields = {}) =>
      h.command("civilizationCastle", {
        M__REQUEST_ID__H: sfs.string(action),
        operationId: sfs.string(randomUUID()),
        ...params,
      });
    const key = sfs.string(randomUUID());
    await Promise.all(
      Array.from({ length: 4 }, () =>
        command("place", { pointId: sfs.int(1211), operationId: key }),
      ),
    );
    const [profile] = await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"));
    expect(profile!.civilizationSorce).toBe(900n);
    const [placed] = await h.db.db.select().from(civilization_castle);
    expect(placed!.status).toBe(1);
    expect(placed!.pointId).toBe(1211);
    await expect(command("place", { pointId: sfs.int(1221) })).rejects.toThrow();
    const interval = Number(h.rules.items.get("civilization_fortress")!.k2) * 1000;
    h.clock.now = Number(placed!.buildTime) + interval * 3 + 123;
    const info = await command("info");
    expect(info.body.status!.value).toBe(2);
    expect(info.body.resourceNum!.value).toBe(18);
    const [produced] = await h.db.db.select().from(civilization_castle);
    expect(produced!.lastOutputTime).toBe(placed!.buildTime! + BigInt(interval * 3));
    const settleId = sfs.string(randomUUID());
    const replies = await Promise.all(
      Array.from({ length: 4 }, () =>
        command("settle", { operationId: settleId, gainCount: sfs.int(10) }),
      ),
    );
    expect(replies.every((r) => r.body.gainCount!.value === 10)).toBe(true);
    const itemId = h.rules.items.get("civilization_fortress")!.k1!;
    const quantity = async () =>
      (await h.db.db.select().from(user_item).where(eq(user_item.itemId, itemId))).reduce(
        (sum, row) => sum + row.count,
        0,
      );
    expect(await quantity()).toBe(10);
    await expect(command("settle")).rejects.toThrow();
    await command("remove");
    expect(await quantity()).toBe(18);
    expect((await h.db.db.select().from(civilization_castle))[0]!.status).toBe(0);
    expect((await h.db.db.select().from(worldpoint)).every((row) => row.pointType === 0)).toBe(
      true,
    );
  } finally {
    await h.close();
  }
}, 120000);

test("castle speed and move costs roll back on invalid or occupied map tiles", async () => {
  const h = await cityHarness([createCivilizationCastleDomain(1200)]);
  try {
    h.rules.items.set("civilization_fortress", {
      ...h.rules.items.get("civilization_fortress")!,
      k3: "1",
    });
    h.rules.features.set("civilization_fortress_on", {
      id: "civilization_fortress_on",
      online: "all",
      test: "all",
      version: "1.0.0",
    });
    await h.db.db
      .update(userprofile)
      .set({ civilizationSorce: 1000n })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: 1, worldId: 0, color: 1, lastCityDefTime: 0n });
    await h.db.db
      .insert(user_building)
      .values({ uid: "owner", uuid: "civilization-building", itemId: 443000, level: 1, pos: 22 });
    for (const base of [10, 20])
      for (const id of [base, base + 1, base + 1200, base + 1201])
        await h.db.db.insert(worldpoint).values({
          id,
          worldId: 0,
          x: (id - 1) % 1200,
          y: Math.floor((id - 1) / 1200),
          areaId: 0,
          gridType: 2,
          grid2Type: 0,
          pointType: 0,
          resLevel: 0,
          resInitValue: 0,
        });
    const command = (action: string, params: Fields = {}) =>
      h.command("civilizationCastle", {
        M__REQUEST_ID__H: sfs.string(action),
        operationId: sfs.string(randomUUID()),
        ...params,
      });
    await command("place", { pointId: sfs.int(1211) });
    await command("speedUp", { isGold: sfs.int(1) });
    expect((await h.db.db.select().from(civilization_castle))[0]!.status).toBe(2);
    const moveItem = h.rules.items.get("civilization_fortress")!.k4!;
    await h.db.db.insert(user_item).values({
      uuid: "move-item",
      ownerId: "owner",
      itemId: moveItem,
      count: 1,
      value: 0,
      vanishTime: 0n,
    });
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 1, ownerId: "other" })
      .where(eq(worldpoint.id, 20));
    await expect(command("move", { pointId: sfs.int(1221) })).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "move-item")))[0]!.count,
    ).toBe(1);
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 0, ownerId: "" })
      .where(eq(worldpoint.id, 20));
    await command("move", { pointId: sfs.int(1221) });
    expect((await h.db.db.select().from(civilization_castle))[0]!.pointId).toBe(1221);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0]!.pointType,
    ).toBe(0);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1221)))[0]!.pointType,
    ).toBe(68);
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 20)))[0]).toMatchObject(
      { pointType: 69, pointItem: "" },
    );
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "move-item")))[0]!.count,
    ).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
