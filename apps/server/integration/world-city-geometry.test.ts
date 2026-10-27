import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { expect, test } from "bun:test";
import { eq, inArray } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { createCivilizationCastleDomain } from "@opencok/services/civilization-castle";
import { readWorldMutationState } from "@opencok/repositories/world-march-runtime";
import { fenceRealmTransaction } from "@opencok/repositories/realm-authority";
import { decode, encode, int, sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture(native = false) {
  const h = await cityHarness([createWorldMarchDomain(1200), createCivilizationCastleDomain(1200)]),
    anchor = native ? 1202 : 1;
  h.rules.features.set("world_march", {
    id: "world_march",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  h.rules.features.set("civilization_fortress_on", {
    id: "civilization_fortress_on",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  await h.db.db
    .insert(user_world)
    .values({ uid: "owner", pointId: anchor, worldId: 0, lastCityDefTime: 123n });
  await h.db.db.update(userprofile).set({ worldPoint: anchor }).where(eq(userprofile.uid, "owner"));
  for (const id of [1, 2, 1201, 1202, 10, 20, 21, 1220, 1221])
    await h.db.db.insert(worldpoint).values({
      id,
      worldId: 0,
      x: (id - 1) % 1200,
      y: Math.floor((id - 1) / 1200),
      areaId: 0,
      gridType: 2,
      grid2Type: 0,
      pointType: id === anchor ? 1 : [1, 2, 1201, 1202].includes(id) ? 8 : id === 10 ? 3 : 0,
      pointItem:
        id === 10 ? "0" : [1, 2, 1201, 1202].includes(id) && id !== anchor ? String(anchor) : null,
      ownerId: [1, 2, 1201, 1202].includes(id) ? "owner" : "",
      resLevel: id === anchor ? 7 : 0,
      resInitValue: id === 10 ? 1000 : 0,
      shieldTime: id === anchor ? 88888888n : 0n,
      cityDefValue: id === anchor ? 543 : 0,
      monsterInfo: id === anchor ? Buffer.from("synthetic-city-metadata") : null,
      flushFlag: id === anchor ? 3 : 0,
      fireTime: id === anchor ? 456n : 0n,
    });
  await h.db.db.insert(user_army).values({ uid: "owner", armyId: "107000", level: 1, free: 100 });
  const tick = () => h.command("world.tick", {}),
    start = () =>
      h.command("world.march", {
        point: sfs.int(10),
        type: sfs.int(0),
        soldiers: sfs.object({ "107000": sfs.int(10) }),
      });
  const state = () =>
    h.db.db
      .select()
      .from(worldpoint)
      .where(inArray(worldpoint.id, [1, 2, 1201, 1202]));
  return { ...h, tick, start, state };
}
test("concurrent recovery normalizes a proven maintained city without moving tiles or losing main metadata", async () => {
  const h = await fixture();
  try {
    await Promise.all(Array.from({ length: 4 }, () => h.tick()));
    expect((await h.state()).map((row) => row.id).sort((a, b) => a - b)).toEqual([
      1, 2, 1201, 1202,
    ]);
    expect((await h.state()).find((row) => row.id === 1202)).toMatchObject({
      pointType: 1,
      resLevel: 7,
      shieldTime: 88888888n,
      cityDefValue: 543,
      monsterInfo: Buffer.from("synthetic-city-metadata"),
      flushFlag: 3,
      fireTime: 456n,
    });
    expect(
      (await h.state())
        .filter((row) => row.id !== 1202)
        .every((row) => row.pointType === 8 && row.pointItem === "1202" && row.ownerId === "owner"),
    ).toBe(true);
    expect((await h.db.db.select().from(user_world))[0]).toMatchObject({
      pointId: 1202,
      lastCityDefTime: 123n,
    });
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.worldPoint,
    ).toBe(1202);
    const before = await h.state();
    await h.tick();
    expect(await h.state()).toEqual(before);
  } finally {
    await h.close();
  }
}, 120000);
test("native imported cities remain byte-for-byte unchanged during recovery", async () => {
  const h = await fixture(true);
  try {
    const before = await h.state();
    await h.tick();
    expect(await h.state()).toEqual(before);
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1202);
  } finally {
    await h.close();
  }
}, 120000);
test("owned known checkpoints reanchor across a fresh database pool while retaining troops, segments and every deadline", async () => {
  const h = await fixture();
  try {
    await h.start();
    const [march] = await h.db.db.select().from(world_march),
      [record] = await h.db.db.select().from(world_march_checkpoint),
      data = decode(record!.payload);
    await h.db.db.update(user_world).set({ pointId: 1 });
    await h.db.db.update(userprofile).set({ worldPoint: 1 }).where(eq(userprofile.uid, "owner"));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 8, pointItem: "1" })
      .where(inArray(worldpoint.id, [1, 2, 1201, 1202]));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 1, pointItem: null })
      .where(eq(worldpoint.id, 1));
    await h.db.db.update(world_march).set({ ownerId: 1 });
    data.origin = sfs.int(1);
    await h.db.db.update(world_march_checkpoint).set({ payload: Buffer.from(encode(data)) });
    const fresh = createDatabase("kingdom", h.connection);
    try {
      await fresh.db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, h.authority);
        await tx.select().from(userprofile).where(eq(userprofile.uid, "owner")).for("update");
        await readWorldMutationState(tx, "owner", undefined, 1200, "world.tick");
      });
    } finally {
      await fresh.close();
    }
    const [saved] = await h.db.db.select().from(world_march),
      [checkpoint] = await h.db.db.select().from(world_march_checkpoint),
      restored = decode(checkpoint!.payload);
    expect(saved).toEqual({ ...march!, ownerId: 1202 });
    expect(checkpoint).toEqual({
      ...record!,
      payload: Buffer.from(encode({ ...data, origin: sfs.int(1202) })),
    });
    expect(int(restored, "origin")).toBe(1202);
    expect(restored.segments).toEqual(data.segments);
    expect(restored.dueAt).toEqual(data.dueAt);
    h.clock.now = Number(record!.dueAt) + 3600000;
    await h.tick();
    expect((await h.db.db.select().from(user_army))[0]).toMatchObject({ free: 100, march: 0 });
    expect(await h.db.db.select().from(world_march)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("unknown marches defer normalization while preserving an explicit proven legacy footprint", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(world_march).values({
      uuid: "unknown",
      ownerUid: "owner",
      ownerId: 1,
      targetId: 10,
      type: 7,
      worldId: 0,
      marchStartTime: 100n,
    });
    const snapshot = await h.state();
    await h.tick();
    expect(await h.state()).toEqual(snapshot);
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    const result = await h.db.db.transaction((tx) =>
      readWorldMutationState(tx, "owner", undefined, 1200, "world.tick"),
    );
    expect(result.cityFootprint).toEqual([1, 2, 1201, 1202]);
    await h.db.db.delete(world_march).where(eq(world_march.uuid, "unknown"));
    await h.tick();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1202);
  } finally {
    await h.close();
  }
}, 120000);
test("foreign incoming references and ambiguous ownership never rewrite existing anchors or march evidence", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(world_march).values({
      uuid: "incoming",
      ownerUid: "other",
      ownerId: 100,
      targetId: 1,
      type: 1,
      worldId: 0,
      marchStartTime: 100n,
    });
    await h.tick();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    expect((await h.db.db.select().from(world_march))[0]!.targetId).toBe(1);
    await h.db.db.delete(world_march);
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 8, ownerId: "owner", pointItem: "1" })
      .where(eq(worldpoint.id, 20));
    const before = await h.state();
    await h.tick();
    expect(await h.state()).toEqual(before);
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    await expect(h.start()).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
test("failed recovery receipts roll back city normalization, metadata and pointers atomically", async () => {
  const h = await fixture();
  try {
    const before = await h.state();
    await h.db.pool.query(
      `create function reject_geometry() returns trigger language plpgsql as $$ begin if new.command='world.tick' then raise exception 'synthetic geometry failure'; end if; return new; end $$`,
    );
    await h.db.pool.query(
      `create trigger reject_geometry before insert on opencok_kingdom.command_receipt for each row execute function reject_geometry()`,
    );
    await expect(h.tick()).rejects.toThrow();
    expect(await h.state()).toEqual(before);
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.worldPoint,
    ).toBe(1);
    await h.db.pool.query(`drop trigger reject_geometry on opencok_kingdom.command_receipt`);
    await h.tick();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1202);
  } finally {
    await h.close();
  }
}, 120000);
test("native teleport reserves the correct four cells and updates profile and range links without leaving ghost tiles", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .insert(user_item)
      .values({ uuid: "teleport", ownerId: "owner", itemId: "200002", count: 1 });
    await h.command("world.mv", { point: sfs.int(1221), itemUUid: sfs.string("teleport") });
    expect(
      (await h.state()).every(
        (row) => row.pointType === 0 && !row.ownerId && row.pointItem === null,
      ),
    ).toBe(true);
    const city = await h.db.db.select().from(worldpoint).where(eq(worldpoint.ownerId, "owner"));
    expect(city.map((row) => row.id).sort((a, b) => a - b)).toEqual([20, 21, 1220, 1221]);
    expect(city.find((row) => row.pointType === 1)!.id).toBe(1221);
    expect(city.filter((row) => row.pointType === 8).every((row) => row.pointItem === "1221")).toBe(
      true,
    );
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.worldPoint,
    ).toBe(1221);
  } finally {
    await h.close();
  }
}, 120000);
test("legacy civilization castles normalize their own main and range cells before normal operations", async () => {
  const h = await fixture();
  try {
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "owner", pointType: 69 })
      .where(inArray(worldpoint.id, [20, 21, 1220, 1221]));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 68, cityDefValue: 789 })
      .where(eq(worldpoint.id, 20));
    await h.db.db
      .insert(civilization_castle)
      .values({ uid: "owner", level: 1, pointId: 20, status: 1, buildTime: 9223372036854775807n });
    await h.command("civilizationCastle", { M__REQUEST_ID__H: sfs.string("info") });
    expect((await h.db.db.select().from(civilization_castle))[0]!.pointId).toBe(1221);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1221)))[0],
    ).toMatchObject({ pointType: 68, cityDefValue: 789 });
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 20)))[0]).toMatchObject(
      { pointType: 69, pointItem: null },
    );
  } finally {
    await h.close();
  }
}, 120000);

test("pending foreign arrivals retain their original city binding until the delivery has acknowledged", async () => {
  const h = await fixture();
  try {
    await h.db.db.insert(mutation_outbox).values({
      kingdomId: 1,
      ownerUid: "other",
      requestId: "arrival",
      eventId: "arrival",
      eventType: "world.tick",
      payload: Buffer.from(
        encode({
          troubles: sfs.array([sfs.object({ target: sfs.string("owner"), point: sfs.int(1) })]),
        }),
      ),
      createdAt: 1n,
      publishedAt: 0n,
    });
    await h.tick();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    await h.db.db
      .update(mutation_outbox)
      .set({ publishedAt: 2n })
      .where(eq(mutation_outbox.eventId, "arrival"));
    await h.tick();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1202);
  } finally {
    await h.close();
  }
}, 120000);

test("native imported ranges without owner or pointer metadata remain readable and movable without repair", async () => {
  const h = await fixture(true);
  try {
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: null, pointItem: null })
      .where(inArray(worldpoint.id, [1, 2, 1201]));
    const before = await h.state();
    await h.tick();
    expect(await h.state()).toEqual(before);
    await h.start();
    expect((await h.db.db.select().from(world_march))[0]!.ownerId).toBe(1202);
    await h.db.db
      .insert(user_item)
      .values({ uuid: "teleport", ownerId: "owner", itemId: "200002", count: 1 });
    await h.command("world.mv", { point: sfs.int(1221), itemUUid: sfs.string("teleport") });
    expect((await h.state()).every((row) => row.pointType === 0 && !row.ownerId)).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);

test("preflight observes the physical legacy city without rewriting anchors, troop reservations or metadata", async () => {
  const h = await fixture();
  try {
    const before = await h.state(),
      profile = (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0],
      army = await h.db.db.select().from(user_army);
    await h.command("world.march.check", {
      point: sfs.int(10),
      type: sfs.int(0),
      soldiers: sfs.object({ "107000": sfs.int(10) }),
    });
    expect(await h.state()).toEqual(before);
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.worldPoint,
    ).toBe(profile!.worldPoint);
    expect(await h.db.db.select().from(user_army)).toEqual(army);
    expect(await h.db.db.select().from(world_march)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
test("gold-funded random teleport selects a native free footprint and records the actual debit once", async () => {
  const h = await fixture(true);
  try {
    const before = (
        await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner"))
      )[0]!.gold!,
      price = BigInt(h.rules.goods.get("200001")!.price!);
    await h.command("world.mv.gold", { point: sfs.int(0) });
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(1221);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(before - price);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1221)))[0]!.pointType,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
