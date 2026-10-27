import { unregisteredWorldMarches } from "@opencok/repositories/world-march-runtime";
import nativeMarch from "../test/fixtures/reconnect-march-army.json";
import { decodeWorldMarchArmy, encodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { createDatabase } from "@opencok/drizzle";
import { createActivityExecutor } from "@opencok/repositories/timed-activity";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { randomUUID } from "node:crypto";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { expect, test } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, decode, encode, type Fields } from "@opencok/messages/sfs";

async function harness(slots = 2) {
  const h = await cityHarness([createWorldMarchDomain(1200)]);
  try {
    h.rules.features.set("world_march", {
      id: "world_march",
      online: "all",
      test: "all",
      version: "1.0.0",
    });
    h.rules.items.set("on_event2", { ...h.rules.items.get("on_event2")!, k4: "1", k5: "10" });
    for (const [owner, anchor] of [
      ["owner", 1202],
      ["other", 1208],
    ] as const) {
      await h.db.db
        .update(userprofile)
        .set({ worldPoint: anchor })
        .where(eq(userprofile.uid, owner));
      await h.db.db
        .insert(user_world)
        .values({ uid: owner, worldId: 0, pointId: anchor, color: 1, lastCityDefTime: 0n });
      await h.db.db.insert(user_army).values({ uid: owner, armyId: "107000", level: 1, free: 100 });
      for (const id of worldFootprint(anchor, 1200))
        {await h.db.db.insert(worldpoint).values({
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
          resLevel: 1,
          resInitValue: 0,
        });}
    }
    for (const id of worldFootprint(6005, 1200))
      {await h.db.db.insert(worldpoint).values({
        id,
        worldId: 0,
        x: (id - 1) % 1200,
        y: Math.floor((id - 1) / 1200),
        areaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: id === 6005 ? 37 : 38,
        pointItem: "1",
        resLevel: id === 6005 ? slots : 0,
        resInitValue: 40,
        resCostValue: 0,
        flushTime: 99999999n,
      });}
    const start = (owner = "owner") =>
        h.command(
          "world.march",
          {
            point: sfs.int(6005),
            type: sfs.int(0),
            soldiers: sfs.object({ "107000": sfs.int(100) }),
          },
          owner,
        ),
      tick = (owner = "owner") => h.command("world.tick", {}, owner),
      checkpoints = () =>
        h.db.db.select().from(world_march_checkpoint).orderBy(world_march_checkpoint.id),
      target = async () =>
        (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 6005)))[0]!,
      balances = async () =>
        (await h.db.db.select().from(user_resource).orderBy(user_resource.uid)).map((row) => ({
          uid: row.uid,
          stone: row.stone,
        }));
    return { ...h, start, tick, checkpoints, target, balances };
  } catch (error) {
    await h.close();
    throw error;
  }
}

test("shared resource admission reschedules owned foreign checkpoints and conserves stock, troops and rewards with durable checkpoints", async () => {
  const h = await harness();
  try {
    const original = await h.balances();
    const departed = await Promise.all([h.start(), h.start("other")]);
    expect(departed[0]!.body.mt).toEqual(sfs.int(56000));
    const outgoing = await h.checkpoints();
    h.clock.now = Math.max(...outgoing.map((row) => Number(row.dueAt)));
    await h.tick();
    const first = (await h.checkpoints()).find((row) => row.ownerUid === "owner")!;
    await h.tick("other");
    const occupied = await h.checkpoints(),
      foreign = occupied.find((row) => row.ownerUid === "owner")!;
    expect(foreign.version).toBeGreaterThan(first.version);
    expect(foreign.dueAt).toBeLessThan(first.dueAt);
    expect((await h.target()).monsterCurrHP).toBe(2);
    const detail = await h.command("resource.new.detail", { point: sfs.int(6005) });
    expect(decode(encode(detail.body)).existMember).toEqual(sfs.int(2));
    const members = detail.body.army!.value as { value: Fields }[];
    expect(members).toHaveLength(2);
    expect(members.map((row) => row.value.uid!.value).sort()).toEqual(["other", "owner"]);
    expect(members[0]!.value.totalTroops).toEqual(sfs.int(100));
    const priorArmies = await h.db.db.select().from(user_army);
    h.clock.now = Math.max(...occupied.map((row) => Number(row.dueAt))) + 100000;
    const fresh = createDatabase("kingdom", { ...h.connection, max: 4 });
    try {
      const service = new TimedActivityService(
        createActivityExecutor(fresh.db, h.authority, h.handlers.domains, () => h.clock.now, {
          command: h.handlers.command,
          next: h.handlers.next,
          accelerate: h.handlers.accelerate,
        }),
        h.rules,
        h.effects,
      );
      await Promise.all(
        ["owner", "other"].map((owner) =>
          service.domainCommand(owner, "world.tick", { operationId: sfs.string(randomUUID()) }),
        ),
      );
    } finally {
      await fresh.close();
    }
    const after = await h.balances(),
      target = await h.target(),
      armies = await h.db.db.select().from(user_army);
    const credited = after.reduce(
      (sum, row) => sum + row.stone - original.find((value) => value.uid === row.uid)!.stone,
      0n,
    );
    expect(credited).toBe(BigInt(target.resCostValue!));
    expect(credited).toBeGreaterThan(0n);
    expect(credited).toBeLessThanOrEqual(40n);
    expect(target.monsterCurrHP).toBe(0);
    expect(target.pointType).toBe(37);
    expect(armies.every((row) => row.free === 100 && row.march === 0)).toBe(true);
    expect(priorArmies.every((row) => row.free === 0 && row.march === 100)).toBe(true);
    expect(await h.db.db.select().from(world_march)).toHaveLength(0);
    const items = await h.db.db.select().from(user_item).orderBy(user_item.uuid);
    expect(
      items.filter((row) => row.ownerId === "owner").reduce((sum, row) => sum + row.count, 0),
    ).toBeGreaterThan(0);
    expect(
      items.filter((row) => row.ownerId === "other").reduce((sum, row) => sum + row.count, 0),
    ).toBeGreaterThan(0);
    const beforeRetry = await h.balances();
    await Promise.all([h.tick(), h.tick("other")]);
    expect(await h.balances()).toEqual(beforeRetry);
    expect(await h.db.db.select().from(user_item).orderBy(user_item.uuid)).toEqual(items);
  } finally {
    await h.close();
  }
}, 120000);

test("full shared resources return an arriving party without charging or changing another player's troops", async () => {
  const h = await harness(1);
  try {
    await h.start();
    h.clock.now = Number((await h.checkpoints())[0]!.dueAt);
    await h.tick();
    await h.start("other");
    const incoming = (await h.checkpoints()).find((row) => row.ownerUid === "other")!;
    h.clock.now = Number(incoming.dueAt);
    await h.tick("other");
    const [other] = await h.db.db
      .select()
      .from(world_march)
      .where(eq(world_march.ownerUid, "other"));
    expect(other!.state).toBe(2);
    expect((await h.target()).monsterCurrHP).toBe(1);
    const messages = await h.db.db.select().from(mail).where(eq(mail.toUser, "other"));
    expect(messages).toHaveLength(1);
    expect(messages[0]!.rewardId).toBeNull();
    h.clock.now += 100000;
    await h.tick("other");
    const [army] = await h.db.db.select().from(user_army).where(eq(user_army.uid, "other"));
    expect(army!.free).toBe(100);
    expect(army!.march).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);

test("shared recall extends a peer deadline while committing only actual collected cargo", async () => {
  const h = await harness();
  try {
    await Promise.all([h.start(), h.start("other")]);
    h.clock.now = Math.max(...(await h.checkpoints()).map((row) => Number(row.dueAt)));
    await h.tick();
    await h.tick("other");
    const before = (await h.checkpoints()).find((row) => row.ownerUid === "other")!;
    h.clock.now += 1000;
    const own = (await h.checkpoints()).find((row) => row.ownerUid === "owner")!;
    await h.command("world.march.retreat", { uuid: sfs.string(own.id) });
    const after = (await h.checkpoints()).find((row) => row.ownerUid === "other")!;
    expect(after.dueAt).toBeGreaterThan(before.dueAt);
    expect(after.version).toBe(before.version + 1);
    const target = await h.target();
    expect(target.monsterCurrHP).toBe(1);
    expect(target.resCostValue).toBeGreaterThan(0);
    expect(target.resCostValue).toBeLessThan(40);
    const peer = (await h.db.db.select().from(user_army).where(eq(user_army.uid, "other")))[0]!;
    expect(peer.free).toBe(0);
    expect(peer.march).toBe(100);
    h.clock.now = Number(after.dueAt) + 100000;
    await Promise.all([h.tick(), h.tick("other")]);
    expect(
      (await h.db.db.select().from(user_army)).every((row) => row.free === 100 && row.march === 0),
    ).toBe(true);
    expect((await h.target()).resCostValue).toBeLessThanOrEqual(40);
  } finally {
    await h.close();
  }
}, 120000);

test("foreign deadline failure rolls back shared admission, counters, troops and checkpoints atomically", async () => {
  const h = await harness();
  try {
    await Promise.all([h.start(), h.start("other")]);
    h.clock.now = Math.max(...(await h.checkpoints()).map((row) => Number(row.dueAt)));
    await h.tick();
    const before = {
      checkpoints: await h.checkpoints(),
      target: await h.target(),
      armies: await h.db.db.select().from(user_army).orderBy(user_army.uid),
      marches: await h.db.db.select().from(world_march).orderBy(world_march.uuid),
    };
    await h.db.db.execute(
      sql.raw(
        `CREATE FUNCTION opencok_kingdom.deny_shared_timing() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW."ownerUid"='owner' THEN RAISE EXCEPTION 'synthetic timing write failure'; END IF; RETURN NEW; END $$`,
      ),
    );
    await h.db.db.execute(
      sql.raw(
        `CREATE TRIGGER shared_timing_failure BEFORE UPDATE ON opencok_kingdom.world_march_checkpoint FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.deny_shared_timing()`,
      ),
    );
    const request = { operationId: sfs.string(randomUUID()) };
    await expect(h.command("world.tick", request, "other")).rejects.toThrow();
    expect(await h.checkpoints()).toEqual(before.checkpoints);
    expect(await h.target()).toEqual(before.target);
    expect(await h.db.db.select().from(user_army).orderBy(user_army.uid)).toEqual(before.armies);
    expect(await h.db.db.select().from(world_march).orderBy(world_march.uuid)).toEqual(
      before.marches,
    );
    await h.db.db.execute(
      sql.raw(`DROP TRIGGER shared_timing_failure ON opencok_kingdom.world_march_checkpoint`),
    );
    await h.command("world.tick", request, "other");
    expect((await h.target()).monsterCurrHP).toBe(2);
    const peer = (await h.checkpoints()).find((row) => row.ownerUid === "owner")!;
    expect(peer.version).toBeGreaterThan(
      before.checkpoints.find((row) => row.ownerUid === "owner")!.version,
    );
  } finally {
    await h.close();
  }
}, 120000);

test("shared detail repairs only the factual party counter and retains native member and slot fields", async () => {
  const h = await harness();
  try {
    await h.db.db.update(worldpoint).set({ monsterCurrHP: 99 }).where(eq(worldpoint.id, 6005));
    const before = await h.db.db.select().from(user_army);
    const reply = await h.command("resource.new.detail", { point: sfs.int(6005) });
    expect(reply.body).toMatchObject({
      existMember: sfs.int(0),
      maxMember: sfs.int(2),
      army: sfs.array([]),
    });
    expect((await h.target()).monsterCurrHP).toBe(0);
    expect(await h.db.db.select().from(user_army)).toEqual(before);
    expect(await h.checkpoints()).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);

test("owned imported shared parties recover native raw load into resource capacity without resetting their collection clock", async () => {
  const h = await harness();
  try {
    await h.start();
    h.clock.now = Number((await h.checkpoints())[0]!.dueAt);
    await h.tick();
    const saved = (await h.checkpoints())[0]!,
      before = decode(saved.payload);
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, saved.id));
    await h.tick();
    const adopted = (await h.checkpoints())[0]!,
      after = decode(adopted.payload);
    expect(after.capacity).toEqual(before.capacity);
    expect(after.startedAt).toEqual(before.startedAt);
    expect(after.dueAt).toEqual(before.dueAt);
    expect(after.targetType).toEqual(sfs.int(37));
    h.clock.now = Number(adopted.dueAt) + 100000;
    await h.tick();
    expect((await h.target()).resCostValue).toBe(Number(before.capacity!.value));
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!.free,
    ).toBe(100);
  } finally {
    await h.close();
  }
}, 120000);

test("native shared outbound parties with an empty load cache adopt actual troops and collection rules without a second reservation", async () => {
  const h = await harness();
  try {
    await h.start();
    const saved = (await h.checkpoints())[0]!,
      before = decode(saved.payload),
      [party] = await h.db.db.select().from(world_march);
    const army = decodeWorldMarchArmy(party!.armyInfo!)!;
    await h.db.db
      .update(world_march)
      .set({ armyInfo: encodeWorldMarchArmy({ ...army, cachedLoad: 0 }), collectSpd: 0 })
      .where(eq(world_march.uuid, party!.uuid));
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, saved.id));
    expect((await unregisteredWorldMarches(h.db.db)).map((row) => row.id)).toContain(party!.uuid);
    await h.tick();
    const after = decode((await h.checkpoints())[0]!.payload);
    expect(after.capacity).toEqual(before.capacity);
    expect(after.collectRate).toEqual(before.collectRate);
    expect(after.dueAt).toEqual(before.dueAt);
    const [balance] = await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner"));
    expect(balance!.free).toBe(0);
    expect(balance!.march).toBe(100);
    h.clock.now = Number((await h.checkpoints())[0]!.dueAt);
    await h.tick();
    expect((await h.target()).monsterCurrHP).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);
test("native shared return cargo and queued rewards recover after target expiry and fund only their saved amounts once", async () => {
  const h = await harness();
  try {
    h.rules.reconnect.rewards!.set("imported-shared", { id: "imported-shared", wood: "2" });
    await h.start();
    const [party] = await h.db.db.select().from(world_march),
      before = (
        await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
      )[0]!;
    await h.db.db
      .update(world_march)
      .set({
        state: 2,
        returnStartTime: BigInt(h.clock.now),
        arrivalTime: BigInt(h.clock.now) + 1000n,
        collectSpd: 0,
        plunderRes: '[{"t":1,"v":20},{"r":"imported-shared","v":3}]',
      })
      .where(eq(world_march.uuid, party!.uuid));
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, party!.uuid));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 0, pointItem: null, resInitValue: 0, resCostValue: 0, monsterCurrHP: 0 })
      .where(eq(worldpoint.id, 6005));
    expect((await unregisteredWorldMarches(h.db.db)).map((row) => row.id)).toContain(party!.uuid);
    await h.tick();
    const adopted = (await h.checkpoints())[0]!,
      saved = decode(adopted.payload);
    expect(saved.targetResource).toEqual(sfs.int(1));
    expect(saved.sharedReward).toEqual(sfs.string("wood,0,6"));
    expect((await h.db.db.select().from(world_march))[0]!.plunderRes).toBe(
      '[{"t":1,"v":20},{"r":"imported-shared","v":3}]',
    );
    h.clock.now += 2000;
    await h.tick();
    const after = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    expect(after.stone - before.stone).toBe(20n);
    expect(after.wood - before.wood).toBe(6n);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!.free,
    ).toBe(100);
    expect((await h.target()).pointType).toBe(0);
    await h.tick();
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0],
    ).toEqual(after);
  } finally {
    await h.close();
  }
}, 120000);

test("native Java resource parties derive live troop load and apply resource weights instead of treating the raw cache as resource units", async () => {
  const h = await harness();
  try {
    const source = Buffer.from(nativeMarch.companions, "base64"),
      name = Buffer.concat([Buffer.from([0x74, 0, 15]), Buffer.from("synthetic-owner")]),
      offset = source.indexOf(name);
    expect(offset).toBeGreaterThan(0);
    const army = Buffer.concat([
      source.subarray(0, offset),
      Buffer.from([0x74, 0, 5]),
      Buffer.from("owner"),
      source.subarray(offset + name.length),
    ]);
    expect(decodeWorldMarchArmy(army)!.owner).toBe("owner");
    h.rules.arms.set("100001", { ...h.rules.arms.get("107000")!, id: "100001", arm: "3" });
    await h.db.db
      .insert(user_army)
      .values({ uid: "owner", armyId: "100001", level: 1, free: 84, march: 16 });
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 3, pointItem: "1", resLevel: 1, monsterCurrHP: 0 })
      .where(eq(worldpoint.id, 6005));
    await h.db.db.insert(world_march).values({
      uuid: "native-party",
      ownerUid: "owner",
      ownerId: 1202,
      ownerName: "Synthetic",
      type: 0,
      targetId: 6005,
      targetType: 3,
      state: 0,
      worldId: 0,
      marchStartTime: BigInt(h.clock.now),
      marchArrivalTime: BigInt(h.clock.now) + 1000n,
      arrivalTime: BigInt(h.clock.now) + 1000n,
      marchTime: 1000,
      armyInfo: army,
      collectSpd: 1,
    });
    await h.tick();
    const saved = decode((await h.checkpoints())[0]!.payload);
    expect(saved.capacity).toEqual(sfs.int(5));
    expect(decodeWorldMarchArmy(army)!.cachedLoad).toBe(45);
    h.clock.now += 100000;
    await h.tick();
    expect((await h.target()).resCostValue).toBe(5);
    const [returned] = await h.db.db.select().from(user_army).where(eq(user_army.armyId, "100001"));
    expect(returned!.free).toBe(100);
    expect(returned!.march).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
