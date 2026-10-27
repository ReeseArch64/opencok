import { seedSyntheticWorldBirth } from "./support/world-birth";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, inArray } from "drizzle-orm";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { createWorldInterest, dueWorldMarches } from "@opencok/repositories/world-march-runtime";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function worldHarness() {
  const h = await cityHarness([createWorldMarchDomain(1200)]);
  h.rules.features.set("world_march", {
    id: "world_march",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  await h.db.db.insert(user_world).values([
    { uid: "owner", pointId: 1, worldId: 0, color: 1, lastCityDefTime: 0n },
    { uid: "other", pointId: 100, worldId: 0, color: 2, lastCityDefTime: 0n },
  ]);
  await h.db.db.insert(user_army).values({ uid: "owner", armyId: "107000", level: 1, free: 100 });
  for (const id of [1, 2, 1201, 1202, 10, 11, 1210, 1211, 20, 21, 1220, 1221])
    await h.db.db.insert(worldpoint).values({
      id,
      worldId: 0,
      x: (id - 1) % 1200,
      y: Math.floor((id - 1) / 1200),
      areaId: 0,
      gridType: 2,
      grid2Type: 0,
      pointType: id === 10 ? 3 : id === 1 ? 1 : [2, 1201, 1202].includes(id) ? 2 : 0,
      resLevel: 1,
      resInitValue: id === 10 ? 1000 : 0,
      resCostValue: 0,
      pointItem: id === 10 ? "0" : null,
      ownerId: [1, 2, 1201, 1202].includes(id) ? "owner" : "",
      ownerName: "Synthetic",
    });
  const start = (operationId = sfs.string(randomUUID())) =>
    h.command("world.march", {
      point: sfs.int(10),
      type: sfs.int(0),
      soldiers: sfs.object({ "107000": sfs.int(10) }),
      operationId,
    });
  const tick = () => h.command("world.tick", { operationId: sfs.string(randomUUID()) });
  await seedSyntheticWorldBirth(h.db.db, h.authority, h.rules);
  return { ...h, start, tick };
}

test("marches reserve once, recover late through gathering and return, and credit cargo exactly once", async () => {
  const h = await worldHarness();
  try {
    const original = h.rules.ranking.heroEvents!.get("9001000")!;
    h.rules.ranking.heroEvents!.set("gather-event", {
      ...original,
      id: "gather-event",
      score: "47001",
      target: "2000000000;2147483646;2147483647",
    });
    await h.db.db.insert(hero_event).values({
      uuid: "gather-stage",
      eventId: "gather-event",
      activityId: "gather-main",
      type: 1,
      rewardType: 1,
      startTime: BigInt(h.clock.now),
      endTime: BigInt(h.clock.now + 1800000),
    });
    const id = sfs.string(randomUUID());
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.start(id)));
    expect(new Set(replies.map((reply) => reply.body.uuid!.value)).size).toBe(1);
    const armies = async () =>
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!;
    expect((await armies()).free).toBe(90);
    expect((await armies()).march).toBe(10);
    const [saved] = await h.db.db.select().from(world_march_checkpoint);
    expect(saved).toBeDefined();
    await expect(h.start()).rejects.toThrow();
    expect((await armies()).free).toBe(90);
    h.clock.now = Number(saved!.dueAt) + 3600000;
    const due = await dueWorldMarches(h.db.db, BigInt(h.clock.now));
    expect(due.length).toBe(1);
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.wood;
    const retry = { operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("world.tick", retry)));
    expect((await armies()).free).toBe(100);
    expect((await armies()).march).toBe(0);
    expect((await h.db.db.select().from(world_march)).length).toBe(0);
    const [finished] = await h.db.db.select().from(world_march_checkpoint);
    expect(finished!.status).toBe(1);
    const resource = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    expect(resource.wood - before).toBe(80n);
    expect((await h.db.db.select().from(score_act))[0]).toMatchObject({
      actId: "gather-stage",
      score: 80,
    });
    await h.tick();
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(resource.wood);
    const [point] = await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10));
    expect(point!.resCostValue).toBe(80);
    expect(point!.ownerMarchUUid).toBe("");
    expect((await h.db.db.select().from(score_act))[0]!.score).toBe(80);
  } finally {
    await h.close();
  }
}, 120000);

test("march acceleration, recall and teleport enforce ownership, costs and occupied destinations", async () => {
  const h = await worldHarness();
  try {
    await h.db.db.insert(user_item).values([
      { uuid: "speed", ownerId: "owner", itemId: "200220", count: 2, value: 0 },
      { uuid: "recall", ownerId: "owner", itemId: "200004", count: 2, value: 0 },
      { uuid: "teleport", ownerId: "owner", itemId: "200002", count: 2, value: 0 },
    ]);
    const started = await h.start(),
      id = started.body.uuid!,
      [before] = await h.db.db.select().from(world_march_checkpoint);
    const speed = {
      uuid: id,
      itemUUid: sfs.string("speed"),
      operationId: sfs.string(randomUUID()),
    };
    await Promise.all(Array.from({ length: 3 }, () => h.command("world.march.spd", speed)));
    const [after] = await h.db.db.select().from(world_march_checkpoint);
    expect(after!.dueAt).toBeLessThan(before!.dueAt);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "speed")))[0]!.count,
    ).toBe(1);
    await expect(h.command("world.march.retreat", { uuid: id }, "other")).rejects.toThrow();
    h.clock.now += 1000;
    await h.command("world.march.retreat", { uuid: id });
    const [back] = await h.db.db.select().from(world_march_checkpoint);
    h.clock.now = Number(back!.dueAt);
    await h.tick();
    const move = {
      point: sfs.int(1221),
      itemUUid: sfs.string("teleport"),
      operationId: sfs.string(randomUUID()),
    };
    await h.db.db
      .update(worldpoint)
      .set({ sendHeartDurationTime: 1060n, heartType: "1" })
      .where(eq(worldpoint.id, 1));
    await Promise.all(Array.from({ length: 3 }, () => h.command("world.mv", move)));
    const heartPoints = await h.db.db
      .select()
      .from(worldpoint)
      .where(inArray(worldpoint.id, [1, 20]));
    expect(
      heartPoints.every((row) => row.sendHeartDurationTime === 0n && row.heartType === ""),
    ).toBe(true);
    expect(
      (await h.db.db.select().from(user_world).where(eq(user_world.uid, "owner")))[0]!.pointId,
    ).toBe(1221);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "teleport")))[0]!.count,
    ).toBe(1);
    await expect(
      h.command("world.mv", { ...move, operationId: sfs.string(randomUUID()) }, "other"),
    ).rejects.toThrow();
    const interest = createWorldInterest(h.db.db, h.authority, 1200, () => h.clock.now);
    await interest.subscribe("owner", 20, 0);
    await interest.subscribe("other", 100, 0);
    expect(await interest.interested([20], "owner", "")).toEqual(["owner"]);
  } finally {
    await h.close();
  }
}, 120000);

test("directed teleport recalls active troops and random teleport pins one free destination", async () => {
  const h = await worldHarness();
  try {
    await h.db.db.insert(user_item).values([
      { uuid: "teleport", ownerId: "owner", itemId: "200002", count: 2, value: 0 },
      { uuid: "random", ownerId: "owner", itemId: "200001", count: 2, value: 0 },
    ]);
    await h.start();
    h.clock.now += 1000;
    await h.command("world.mv", { point: sfs.int(1221), itemUUid: sfs.string("teleport") });
    const [recalled] = await h.db.db.select().from(world_march);
    expect(recalled!.state).toBe(2);
    expect(recalled!.ownerId).toBe(1221);
    await expect(
      h.command("world.mv", { point: sfs.int(0), itemUUid: sfs.string("random") }),
    ).rejects.toThrow();
    h.clock.now += 1;
    await h.tick();
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!.free,
    ).toBe(100);
    const request = {
      point: sfs.int(0),
      itemUUid: sfs.string("random"),
      operationId: sfs.string(randomUUID()),
    };
    const replies = await Promise.all(
      Array.from({ length: 3 }, () => h.command("world.mv", request)),
    );
    expect(new Set(replies.map((reply) => reply.body.point!.value)).size).toBe(1);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "random")))[0]!.count,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);

test("unregistered ordinary marches import without reserving troops or paying costs again", async () => {
  const h = await worldHarness();
  try {
    await h.start();
    const [saved] = await h.db.db.select().from(world_march_checkpoint);
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, saved!.id));
    h.clock.now = Number(saved!.dueAt) + 3600000;
    await h.tick();
    const [troops] = await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner"));
    expect(troops!.free).toBe(100);
    expect(troops!.march).toBe(0);
    const [point] = await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10));
    expect(point!.resCostValue).toBe(80);
    expect((await h.db.db.select().from(world_march_checkpoint))[0]!.status).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);

test("native march preflight is a shield and target-occupancy read without troops or overdue march settlement", async () => {
  const h = await worldHarness();
  try {
    const empty = await h.command("world.march.check", { point: sfs.int(10) });
    expect(empty.body.needBreakShield!.type).toBe(Type.Bool);
    expect(empty.body.needBreakShield!.value).toBe(false);
    expect(empty.body.marchTime).toBeUndefined();
    expect(empty.body.armyLoad).toBeUndefined();
    await h.start();
    const [checkpoint] = await h.db.db.select().from(world_march_checkpoint);
    h.clock.now = Number(checkpoint!.dueAt) + 7200000;
    await expect(
      h.command("world.march.check", { point: sfs.int(10), wantToFight: sfs.int(0) }),
    ).rejects.toMatchObject({ code: "103730" });
    await expect(
      h.command("world.march.check", {
        point: sfs.int(10),
        wantToFight: sfs.int(0),
        cityType: sfs.int(3),
      }),
    ).rejects.toMatchObject({ code: "108896" });
    await h.command("world.march.check", { point: sfs.int(10), wantToFight: sfs.int(1) });
    expect((await h.db.db.select().from(world_march_checkpoint))[0]).toEqual(checkpoint);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0]!.resCostValue,
    ).toBe(0);
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 2, ownerId: "other", ownerMarchUUid: "foreign" })
      .where(eq(worldpoint.id, 20));
    const [city] = await h.db.db.select().from(user_world).where(eq(user_world.uid, "owner"));
    await h.db.db
      .update(worldpoint)
      .set({ shieldTime: BigInt(h.clock.now + 60000) })
      .where(eq(worldpoint.id, city!.pointId!));
    const camp = await h.command("world.march.check", { point: sfs.int(20) });
    expect(camp.body.needBreakShield!.value).toBe(true);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!.free,
    ).toBe(90);
    await expect(
      h.command("world.march", {
        point: sfs.int(20),
        type: sfs.int(0),
        soldiers: sfs.object({ "107000": sfs.int(10) }),
      }),
    ).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
