import { expect, test } from "bun:test";
import { eq, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { t_worldboss } from "@opencok/drizzle/schema/opencok_kingdom/t_worldboss";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { createCivilizationCastleDomain } from "@opencok/services/civilization-castle";
import { createTotemDomain } from "@opencok/services/totem";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function fixture() {
  const size = 1201;
  const h = await cityHarness(
    [createCivilizationCastleDomain(size), createTotemDomain(size)],
    true,
    undefined,
    size,
  );
  try {
    for (const id of ["civilization_fortress_on", "totem_on"])
      {h.rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });}
    h.rules.advanced.totems!.set("20015001", {
      ...h.rules.advanced.totems!.get("20015001")!,
      cover_area: "2",
      take_effect_time: "1",
    });
    h.rules.goods.set("211685", { ...h.rules.goods.get("211685")!, permanent_props: "0" });
    const city = 1 + 20 + 20 * size;
    const target = 1 + 100 + 100 * size;
    const cells = worldFootprint(target, size);
    await h.db.db
      .update(userprofile)
      .set({ civilizationSorce: 1000n, worldPoint: city })
      .where(eq(userprofile.uid, "owner"));
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: city, worldId: 0, color: 1, lastCityDefTime: 0n });
    await h.db.db
      .insert(user_building)
      .values({ uid: "owner", uuid: "fortress-building", itemId: 443000, level: 1, pos: 22 });
    await h.db.db.insert(user_item).values({
      uuid: "totem-item",
      ownerId: "owner",
      itemId: "211685",
      count: 1,
      value: 0,
      vanishTime: 0n,
    });
    await h.db.db.insert(worldpoint).values(
      [
        ...worldFootprint(city, size).map((id) => ({
          id,
          ownerId: "owner",
          pointType: id === city ? 1 : 8,
        })),
        ...cells.map((id) => ({ id, ownerId: "", pointType: 0 })),
      ].map((point) => ({
        ...point,
        worldId: 0,
        x: (point.id - 1) % size,
        y: Math.floor((point.id - 1) / size),
        areaId: 0,
        gridType: 2,
        grid2Type: 0,
        resLevel: 0,
        resInitValue: 0,
      })),
    );
    const snapshot = async () =>
      Object.fromEntries(
        await Promise.all(
          [
            "userprofile",
            "user_resource",
            "user_world",
            "user_item",
            "worldpoint",
            "civilization_castle",
            "totem_activation",
            "user_totem",
            "world_march",
            "world_barbarion",
            "t_worldboss",
            "command_receipt",
            "economy_posting",
            "mutation_outbox",
            "mail",
          ].map(async (table) => [
            table,
            (
              await h.db.pool.query(
                `select coalesce(jsonb_agg(to_jsonb(t) order by to_jsonb(t)::text), '[]'::jsonb) as rows from opencok_kingdom.${table} t`,
              )
            ).rows[0].rows,
          ]),
        ),
      );
    return {
      ...h,
      size,
      target,
      cells,
      snapshot,
      castle: () =>
        h.command("civilizationCastle", {
          M__REQUEST_ID__H: sfs.string("place"),
          pointId: sfs.int(target),
        }),
      totem: () =>
        h.command("totem", {
          M__REQUEST_ID__H: sfs.string("put"),
          pointId: sfs.int(target - size - 1),
          itemUUid: sfs.string("totem-item"),
        }),
    };
  } catch (error) {
    await h.close();
    throw error;
  }
}

test("native civilization and totem placement preserve owned empty cells before charging", async () => {
  const h = await fixture();
  try {
    for (const id of h.cells) {
      for (const owner of [
        { ownerId: "other", ownerMarchUUid: "" },
        { ownerId: "", ownerMarchUUid: "reserved" },
      ]) {
        await h.db.db.update(worldpoint).set(owner).where(eq(worldpoint.id, id));
        const before = await h.snapshot();
        await expect(h.castle()).rejects.toThrow();
        await expect(h.totem()).rejects.toThrow();
        expect(await h.snapshot()).toEqual(before);
        await h.db.db
          .update(worldpoint)
          .set({ ownerId: "", ownerMarchUUid: "" })
          .where(eq(worldpoint.id, id));
      }
    }
    await h.castle();
    expect((await h.db.db.select().from(civilization_castle))[0]!.pointId).toBe(h.target);
  } finally {
    await h.close();
  }
}, 120000);

test("native civilization and totem placement preserve pending marches and saved actors", async () => {
  const h = await fixture();
  try {
    for (const id of h.cells) {
      await h.db.db.insert(world_march).values({
        uuid: "pending",
        ownerUid: "other",
        ownerId: 6,
        type: 0,
        targetId: id,
        marchStartTime: 0n,
        worldId: 0,
      });
      let before = await h.snapshot();
      await expect(h.castle()).rejects.toThrow();
      await expect(h.totem()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
      await h.db.db.delete(world_march).where(eq(world_march.uuid, "pending"));
      await h.db.db.insert(world_barbarion).values({ pointId: id, configId: "synthetic" });
      before = await h.snapshot();
      await expect(h.castle()).rejects.toThrow();
      await expect(h.totem()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
      await h.db.db.delete(world_barbarion).where(eq(world_barbarion.pointId, id));
      await h.db.db.insert(t_worldboss).values({ id: 1, point: id, status: 1 });
      before = await h.snapshot();
      await expect(h.castle()).rejects.toThrow();
      await expect(h.totem()).rejects.toThrow();
      expect(await h.snapshot()).toEqual(before);
      await h.db.db.delete(t_worldboss).where(eq(t_worldboss.id, 1));
    }
    await h.totem();
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "totem-item")))[0]!.count,
    ).toBe(0);
    h.clock.now += 60000;
    await h.command("totem.tick", {});
    const cleared = await h.db.db.select().from(worldpoint).where(inArray(worldpoint.id, h.cells));
    expect(cleared).toHaveLength(4);
    expect(cleared.every((point) => point.pointType === 0 && !point.ownerId)).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
