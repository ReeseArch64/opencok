import { seedSyntheticWorldBirth } from "./support/world-birth";
import { expect, test } from "bun:test";
import { eq, inArray } from "drizzle-orm";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { createWorldRecreationDomain } from "@opencok/services/world-recreation";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function recreationHarness(lost = true) {
  const h = await cityHarness([createWorldMarchDomain(1200), createWorldRecreationDomain(1200)]);
  try {
    await h.db.db
      .insert(user_world)
      .values({ uid: "owner", pointId: lost ? 0 : 1202, worldId: 0, lastCityDefTime: 123n });
    await h.db.db
      .update(userprofile)
      .set({ worldPoint: lost ? 0 : 1202 })
      .where(eq(userprofile.uid, "owner"));
    const old = [1, 2, 1201, 1202];
    await h.db.db.insert(worldpoint).values(
      Array.from({ length: 64 }, (_, index) => {
        const x = index % 8,
          y = Math.floor(index / 8),
          id = 1 + x + y * 1200;
        return {
          id,
          worldId: 0,
          x,
          y,
          areaId: 1,
          bornAreaId: 1,
          gridType: 2,
          grid2Type: 0,
          pointType: !lost && old.includes(id) ? (id === 1202 ? 1 : 8) : 0,
          pointItem: !lost && old.includes(id) && id !== 1202 ? "1202" : null,
          ownerId: !lost && old.includes(id) ? "owner" : "",
          resLevel: 0,
          resInitValue: 0,
        };
      }),
    );
    await seedSyntheticWorldBirth(h.db.db, h.authority, h.rules);
    return h;
  } catch (error) {
    await h.close();
    throw error;
  }
}

test("lost resident cities recreate once for free with native footprints, current shield and full wall defense", async () => {
  const h = await recreationHarness();
  try {
    await h.db.db.insert(user_state).values({
      uid: "owner",
      stateId: 500009,
      startTime: 1n,
      endTime: 9000000n,
      type: 1,
      type2: 1,
    });
    const gold = (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
        .gold,
      request = { operationId: sfs.string("recreate-retry") },
      replies = await Promise.all(
        Array.from({ length: 4 }, () => h.command("world.user.rcr", request)),
      ),
      body = replies[0]!.body,
      destination = body.dstPoint!.value as number;
    expect(Object.keys(body).filter((key) => key !== "operationId")).toEqual([
      "srcPoint",
      "dstPoint",
      "point",
      "cityDefValue",
      "lastCityDefTime",
    ]);
    expect(body.srcPoint).toEqual(sfs.int(0));
    expect(body.point).toEqual(sfs.int(destination));
    expect(body.cityDefValue!.type).toBe(Type.Int);
    expect(body.lastCityDefTime).toEqual(sfs.long(1000000n));
    expect(new Set(replies.map((reply) => reply.body.dstPoint!.value)).size).toBe(1);
    const owned = await h.db.db.select().from(worldpoint).where(eq(worldpoint.ownerId, "owner"));
    expect(owned.map((row) => row.id).sort((a, b) => a - b)).toEqual([
      destination - 1201,
      destination - 1200,
      destination - 1,
      destination,
    ]);
    expect(owned.find((row) => row.id === destination)).toMatchObject({
      pointType: 1,
      cityDefValue: Number(h.rules.building("419000", 1).clientParameters![1]!.value),
      shieldTime: 9000000n,
      fireTime: 0n,
    });
    expect(
      owned
        .filter((row) => row.id !== destination)
        .every((row) => row.pointType === 8 && row.pointItem === String(destination)),
    ).toBe(true);
    expect((await h.db.db.select().from(user_world))[0]).toMatchObject({
      pointId: destination,
      lastMoveCityTime: 1000000n,
      lastCityDefTime: 1000000n,
    });
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0],
    ).toMatchObject({ worldPoint: destination, gold });
    await expect(h.command("world.user.rcr", {})).rejects.toThrow();
    const moved: string[] = [];
    for (const event of (await h.db.db.select().from(mutation_outbox)).filter(
      (row) => row.eventType === "world.user.rcr",
    ))
      {await publishWorldMutation(
        event.payload,
        event.eventType,
        1,
        async () => ["owner"],
        async (_uid, command) => {
          if (command === "push.world.mv") {moved.push(command);}
        },
      );}
    expect(moved).toEqual(["push.world.mv"]);
  } finally {
    await h.close();
  }
}, 120000);

test("recreation recalls an owned gathering party without replaying reservations or spending gold", async () => {
  const h = await recreationHarness(false);
  try {
    h.rules.features.set("world_march", {
      id: "world_march",
      online: "all",
      test: "all",
      version: "1.0.0",
    });
    await h.db.db
      .insert(user_army)
      .values({ uid: "owner", armyId: "107000", level: 1, free: 100, march: 0 });
    const resourceId = 7 + 6 * 1200;
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 3, pointItem: "0", resLevel: 1, resInitValue: 1000 })
      .where(eq(worldpoint.id, resourceId));
    await h.command("world.march", {
      point: sfs.int(resourceId),
      type: sfs.int(0),
      soldiers: sfs.object({ "107000": sfs.int(10) }),
    });
    const first = (await h.db.db.select().from(world_march_checkpoint))[0]!;
    h.clock.now = Number(first.dueAt) + 1;
    await h.command("world.tick", {});
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 0, ownerId: "", pointItem: null })
      .where(inArray(worldpoint.id, [1, 2, 1201, 1202]));
    await h.db.db.update(user_world).set({ pointId: 0 }).where(eq(user_world.uid, "owner"));
    await h.db.db.update(userprofile).set({ worldPoint: 0 }).where(eq(userprofile.uid, "owner"));
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.wood;
    await h.command("world.user.rcr", {});
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, resourceId)))[0]!
        .ownerMarchUUid,
    ).toBe("");
    expect((await h.db.db.select().from(user_army))[0]).toMatchObject({ free: 90, march: 10 });
    h.clock.now += 2;
    await h.command("world.tick", {});
    expect((await h.db.db.select().from(user_army))[0]).toMatchObject({ free: 100, march: 0 });
    expect(await h.db.db.select().from(world_march)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(before);
  } finally {
    await h.close();
  }
}, 120000);

test("recreation preserves a lost city when no complete native birth footprint is available", async () => {
  const h = await recreationHarness();
  try {
    await h.db.db.update(worldpoint).set({ gridType: 0 });
    await expect(h.command("world.user.rcr", {})).rejects.toThrow();
    expect((await h.db.db.select().from(user_world))[0]).toMatchObject({
      pointId: 0,
      lastCityDefTime: 123n,
    });
    expect(
      await h.db.db.select().from(worldpoint).where(eq(worldpoint.ownerId, "owner")),
    ).toHaveLength(0);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.worldPoint,
    ).toBe(0);
    expect(
      (await h.db.db.select().from(mutation_outbox)).filter(
        (row) => row.eventType === "world.user.rcr",
      ),
    ).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);

test("a zero-point profile cannot duplicate an existing owned city", async () => {
  const h = await recreationHarness();
  try {
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 1, ownerId: "owner" })
      .where(eq(worldpoint.id, 1202));
    await expect(h.command("world.user.rcr", {})).rejects.toThrow();
    expect((await h.db.db.select().from(user_world))[0]!.pointId).toBe(0);
    expect(
      await h.db.db.select().from(worldpoint).where(eq(worldpoint.ownerId, "owner")),
    ).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
