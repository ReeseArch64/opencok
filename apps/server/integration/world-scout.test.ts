import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { createWorldScoutStore } from "@opencok/repositories/world-scout";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { sfs, decode, encode } from "@opencok/messages/sfs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
async function harness() {
  const h = await cityHarness();
  try {
    h.rules.features.set("world_march", { id: "world_march", online: "close", test: "close" });
    await h.db.db
      .update(userprofile)
      .set({ pic: "caller-picture", appVersion: "12.06.0", worldPoint: 1202 })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: 1202, worldId: 0, lastCityDefTime: 0n });
    await h.db.db.update(user_building).set({ level: 20 }).where(eq(user_building.uid, "other"));
    for (const [owner, anchor] of [
      ["owner", 1202],
      ["other", 1212],
    ] as const)
      for (const id of worldFootprint(anchor, 1200))
        await h.db.db.insert(worldpoint).values({
          id,
          worldId: 0,
          x: (id - 1) % 1200,
          y: Math.floor((id - 1) / 1200),
          areaId: 1,
          gridType: 2,
          grid2Type: 0,
          pointType: id === anchor ? 1 : 8,
          pointItem: id === anchor ? null : String(anchor),
          ownerId: owner,
          resLevel: 99,
          resInitValue: 0,
          shieldTime: 999999999n,
        });
    let effects = new Map<string, string>();
    const game = new GameService(
      {} as GameStore,
      h.rules,
      { kingdomId: 1, mapSize: 1200 },
      () => h.clock.now,
      {
        worldScout: createWorldScoutStore(h.db.db, 1200),
        reconcileAlliance: async () => {
          throw new Error("Scout quotation entered membership mutation");
        },
        worldPowerEffects: async () => effects,
      },
    );
    const quote = (point = 1212) =>
        game.execute("owner", "world.scout.detail", { point: sfs.int(point) }),
      capture = async () => ({
        world: await h.db.db.select().from(user_world),
        points: await h.db.db.select().from(worldpoint).orderBy(worldpoint.id),
        resources: await h.db.db.select().from(user_resource).orderBy(user_resource.uid),
        marches: await h.db.db.select().from(world_march),
        checkpoints: await h.db.db.select().from(world_march_checkpoint),
        receipts: await h.db.db.select().from(command_receipt),
        outbox: await h.db.db.select().from(mutation_outbox),
      });
    return {
      ...h,
      quote,
      capture,
      setEffects: (value: Map<string, string>) => {
        effects = value;
      },
    };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("native scout quotation reads actual castle price and caller picture without troops, shield changes, charges or receipts", async () => {
  const h = await harness();
  try {
    const before = await h.capture(),
      result = await h.quote();
    expect(decode(encode(result.body))).toEqual({
      pic: sfs.string("caller-picture"),
      point: sfs.int(1212),
      scoutTime: sfs.int(18000),
      scoutCost: sfs.int(900),
    });
    expect(result.pushes).toEqual([]);
    expect(await h.capture()).toEqual(before);
    h.setEffects(new Map([["60", '{"value":"999"}']]));
    expect((await h.quote()).body.scoutTime).toEqual(sfs.int(18000));
    h.setEffects(
      new Map([
        ["401", '{"value":"100"}'],
        ["402", '{"value":"100"}'],
        ["404", '{"value":"25"}'],
      ]),
    );
    const modified = (await h.quote()).body;
    expect(modified.scoutTime).toEqual(sfs.int(6000));
    expect(modified.scoutCost).toEqual(sfs.int(675));
    expect(await h.capture()).toEqual(before);
  } finally {
    await h.close();
  }
}, 120000);
test("scout quotation preserves proven legacy physical city cells and rejects absent or foreign-realm state", async () => {
  const h = await harness();
  try {
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 8, pointItem: null })
      .where(eq(worldpoint.id, 1202));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 1, pointItem: null })
      .where(eq(worldpoint.id, 1));
    await h.db.db
      .update(worldpoint)
      .set({ pointItem: null })
      .where(eq(worldpoint.ownerId, "owner"));
    await h.db.db.update(user_world).set({ pointId: 1 }).where(eq(user_world.uid, "owner"));
    await h.db.db.update(userprofile).set({ worldPoint: 1 }).where(eq(userprofile.uid, "owner"));
    const before = await h.capture();
    expect((await h.quote()).body.scoutTime).toEqual(sfs.int(18000));
    expect(await h.capture()).toEqual(before);
    await expect(h.quote(0)).rejects.toThrow();
    await expect(h.quote(2000)).rejects.toThrow();
    await h.db.db.update(user_world).set({ worldId: 7 }).where(eq(user_world.uid, "owner"));
    await expect(h.quote()).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("barbarian scout quotation requires an actual live actor when the point has no owner and keeps its native unmodified price", async () => {
  const h = await harness();
  try {
    await h.db.db.insert(worldpoint).values({
      id: 1222,
      worldId: 0,
      x: 21,
      y: 1,
      areaId: 1,
      gridType: 2,
      grid2Type: 0,
      pointType: 44,
      resLevel: 0,
      resInitValue: 0,
      resCostValue: 0,
      pointItem: "4800000",
      ownerId: null,
      flushTime: BigInt(h.clock.now) + 10000n,
      fireTime: 0n,
    });
    await expect(h.quote(1222)).rejects.toThrow();
    await h.db.db
      .insert(world_barbarion)
      .values({ pointId: 1222, configId: "4800000", currentHP: 300, lastBeAttackedTime: 0n });
    h.setEffects(new Map([["404", '{"value":"100"}']]));
    const before = await h.capture();
    expect((await h.quote(1222)).body.scoutCost).toEqual(sfs.int(90));
    expect(await h.capture()).toEqual(before);
    await h.db.db
      .update(worldpoint)
      .set({ fireTime: BigInt(h.clock.now) })
      .where(eq(worldpoint.id, 1222));
    await expect(h.quote(1222)).rejects.toThrow();
    expect((await h.db.db.select().from(world_barbarion))[0]!.currentHP).toBe(300);
  } finally {
    await h.close();
  }
}, 120000);

test("scout quotations reject banned and foreign principals and foreign resident targets before returning any quote", async () => {
  const h = await harness();
  try {
    for (const change of [{ serverId: 2 }, { banFlag: 1 }, { banTime: BigInt(h.clock.now) + 1n }]) {
      await h.db.db.update(userprofile).set(change).where(eq(userprofile.uid, "owner"));
      await expect(h.quote()).rejects.toThrow();
      await h.db.db
        .update(userprofile)
        .set({ serverId: 1, banFlag: 0, banTime: 0n })
        .where(eq(userprofile.uid, "owner"));
    }
    await h.db.db.update(userprofile).set({ serverId: 2 }).where(eq(userprofile.uid, "other"));
    await expect(h.quote()).rejects.toThrow();
    expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
