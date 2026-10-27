import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import { alliance_skill } from "@opencok/drizzle/schema/opencok_kingdom/alliance_skill";
import { encodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { encodeJavaIntMap } from "@opencok/messages/java-int-map";
import { scoutPairs } from "@opencok/rules/world-scout-report";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { unregisteredWorldMarches } from "@opencok/repositories/world-march-runtime";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { createDatabase } from "@opencok/drizzle";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import { createCityProgressionHandlers } from "@opencok/services/city-progression";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { sfs, decode, Type } from "@opencok/messages/sfs";
import { scoutHarness } from "./support/world-scout";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";

async function checkpoint(h: Awaited<ReturnType<typeof scoutHarness>>) {
  return (
    await h.db.db.select().from(world_march_checkpoint).where(eq(world_march_checkpoint.status, 0))
  )[0]!;
}

test("ordinary scout food, reserved troops, reports and return are atomic and replay safe", async () => {
  const h = await scoutHarness();
  try {
    const params = {
      soldiers: sfs.object({ "107000": sfs.int(10) }),
      operationId: sfs.string(randomUUID()),
    };
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.scout(params)));
    expect(new Set(replies.map((reply) => reply.body.uuid!.value)).size).toBe(1);
    const [march] = await h.db.db
      .select()
      .from(world_march)
      .where(eq(world_march.ownerUid, "owner"));
    expect(march).toMatchObject({
      type: 1,
      targetType: 1,
      state: 0,
      targetUid: "other",
      ownerId: 1202,
    });
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.food,
    ).toBeLessThan(before.food);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0],
    ).toMatchObject({ free: 90, march: 10 });
    expect(
      (await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner")))[0]!.detectNum,
    ).toBe(1);
    const outbound = await checkpoint(h);
    h.clock.now = Number(outbound.dueAt) + 600000;
    const retry = { operationId: sfs.string(randomUUID()) };
    await Promise.all(Array.from({ length: 4 }, () => h.command("world.tick", retry)));
    const returning = await checkpoint(h);
    expect(returning.dueAt).toBeGreaterThan(BigInt(h.clock.now));
    expect(decode(returning.payload).phase!.value).toBe("returning");
    const mails = await h.db.db.select().from(mail);
    expect(mails.length).toBe(2);
    expect(mails.find((row) => row.type === 8)!.toUser).toBe("owner");
    expect(mails.find((row) => row.type === 6)!.toUser).toBe("other");
    const report = JSON.parse(
      Buffer.from(mails.find((row) => row.type === 8)!.contents).toString(),
    );
    expect(report).toMatchObject({ name: "Synthetic", pointId: 1220, pointType: 1 });
    expect(report.defence.arms[0].id).toBe("107000");
    expect(report.defence.arms[0].num).toBeGreaterThanOrEqual(33);
    expect(report.defence.arms[0].num).toBeLessThanOrEqual(50);
    const events = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "world.scout.mail"));
    expect(events.length).toBe(2);
    expect(decode(events[0]!.payload).owner!.type).toBe(Type.String);
    h.clock.now = Number(returning.dueAt);
    await h.tick();
    await h.tick();
    expect((await h.db.db.select().from(world_march)).length).toBe(0);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0],
    ).toMatchObject({ free: 100, march: 0 });
    expect((await h.db.db.select().from(mail)).length).toBe(2);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(before.wood);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "other")))[0]!.free,
    ).toBe(42);
  } finally {
    await h.close();
  }
}, 120000);

test("scout admission rejects special, empty and allied targets without spending or reserving", async () => {
  const h = await scoutHarness();
  try {
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    for (const type of [0, 5, 15, 37, 38, 63]) {
      await h.db.db.update(worldpoint).set({ pointType: type }).where(eq(worldpoint.id, 10));
      await expect(h.scout({ point: sfs.int(10) })).rejects.toThrow();
    }
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "same" })
      .where(sql`${userprofile.uid} in ('owner','other')`);
    await expect(h.scout()).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.food,
    ).toBe(before.food);
    expect((await h.db.db.select().from(world_march)).length).toBe(0);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!.free,
    ).toBe(100);
    expect((await h.db.db.select().from(mail)).length).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);

test("failed report persistence rolls back intel, return and outbox, then retry pins one report", async () => {
  const h = await scoutHarness();
  try {
    await h.scout();
    const outbound = await checkpoint(h);
    h.clock.now = Number(outbound.dueAt);
    await h.db.db.execute(
      sql`alter table ${mail} add constraint scout_test_reject check (type <> 8)`,
    );
    await expect(h.tick()).rejects.toThrow();
    expect((await checkpoint(h)).version).toBe(outbound.version);
    expect((await h.db.db.select().from(mail)).length).toBe(0);
    expect(
      (
        await h.db.db
          .select()
          .from(mutation_outbox)
          .where(eq(mutation_outbox.eventType, "world.scout.mail"))
      ).length,
    ).toBe(0);
    await h.db.db.execute(sql`alter table ${mail} drop constraint scout_test_reject`);
    await h.tick();
    const report = (
      await h.db.db
        .select()
        .from(mail)
        .where(and(eq(mail.toUser, "owner"), eq(mail.type, 8)))
    )[0]!;
    expect(report).toBeDefined();
    await h.tick();
    expect(
      (await h.db.db.select().from(mail).where(eq(mail.uid, report.uid)))[0]!.contents,
    ).toEqual(report.contents);
    expect((await h.db.db.select().from(mail)).length).toBe(2);
  } finally {
    await h.close();
  }
}, 120000);

test("city shield and anti scout branches preserve Source honour cooldown and mail visibility", async () => {
  const h = await scoutHarness();
  try {
    h.clock.now = 200000000;
    h.rules.power.statuses!.set("990001", { id: "990001", effect: "61;1" });
    h.rules.power.statuses!.set("990002", { id: "990002", effect: "62;1" });
    await h.db.db.insert(user_state).values([
      { uid: "other", stateId: 990001, startTime: 0n, endTime: BigInt(h.clock.now + 10000000) },
      { uid: "other", stateId: 990002, startTime: 0n, endTime: BigInt(h.clock.now + 10000000) },
    ]);
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.food;
    await expect(h.scout()).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.food,
    ).toBe(before);
    await h.db.db
      .update(user_building)
      .set({ level: 30, star: 5, progress: 0, effectTime: 0n })
      .where(eq(user_building.uuid, "owner-watchtower"));
    await h.scout();
    expect((await h.db.db.select().from(world_march))[0]!.honourWatchtower).toBe(1);
    expect((await h.building("owner-watchtower"))!.effectTime).toBe(BigInt(h.clock.now));
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    const mails = await h.db.db.select().from(mail);
    const report = JSON.parse(
      Buffer.from(mails.find((row) => row.type === 8)!.contents).toString(),
    );
    expect(Object.keys(report)).toEqual(["protectCD"]);
    expect(report.protectCD).toBeGreaterThan(0);
    expect(mails.find((row) => row.type === 6)!.toUser).toBe("other");
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    await expect(h.scout()).rejects.toThrow();
    expect((await h.db.db.select().from(mail)).length).toBe(2);
    h.rules.features.set("glory_watchtower", {
      id: "glory_watchtower",
      online: "close",
      test: "close",
    });
    await h.scout();
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    const failures = await h.db.db.select().from(mail).where(eq(mail.itemIdFlag, 1));
    expect(failures.length).toBe(1);
    expect(failures[0]).toMatchObject({ toUser: "owner", type: 6, title: "114163" });
    expect(Buffer.from(failures[0]!.contents).toString()).toBe("114164|Synthetic");
    expect((await h.db.db.select().from(mail).where(eq(mail.type, 8))).length).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);

test("a city that moved during the scout returns its troops without inventing intel", async () => {
  const h = await scoutHarness();
  try {
    await h.scout({ soldiers: sfs.object({ "107000": sfs.int(10) }) });
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "", ownerName: "", pointType: 0 })
      .where(eq(worldpoint.id, 1220));
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect((await h.db.db.select().from(mail)).length).toBe(0);
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0],
    ).toMatchObject({ free: 100, march: 0 });
  } finally {
    await h.close();
  }
}, 120000);

test("a fresh pool and realm epoch resumes a pinned scout while fencing the former owner", async () => {
  const h = await scoutHarness();
  const db = createDatabase("kingdom", { ...h.connection, max: 4 });
  try {
    await h.scout();
    const outbound = await checkpoint(h);
    h.clock.now = Number(outbound.dueAt);
    const authority = await acquireRealmAuthority(db.db, 1, () => true, h.clock.now);
    await expect(h.tick()).rejects.toThrow();
    expect((await checkpoint(h)).version).toBe(outbound.version);
    const effects = { world: async () => new Map<number, number>(), emperor: async () => null };
    const handlers = createCityProgressionHandlers(
      (tx: Parameters<typeof createCityProgressionStore>[0], owner, now) =>
        createCityProgressionStore(
          tx,
          owner,
          now,
          async (_tx, _uid, _now, change) => {
            await change();
          },
          1200,
          authority,
        ),
      [createWorldMarchDomain(1200)],
      h.rules,
      effects,
    );
    const service = new TimedActivityService(
      createActivityExecutor(
        db.db,
        authority,
        handlers.domains as ReadonlyMap<number, ActivityDomain>,
        () => h.clock.now,
        { command: handlers.command, next: handlers.next, accelerate: handlers.accelerate },
      ),
      h.rules,
      effects,
    );
    const tick = () =>
      service.domainCommand("owner", "world.tick", { operationId: sfs.string(randomUUID()) });
    await tick();
    const report = (await db.db.select().from(mail).where(eq(mail.type, 8)))[0]!;
    expect(report).toBeDefined();
    await expect(h.tick()).rejects.toThrow();
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await tick();
    await tick();
    expect((await db.db.select().from(world_march)).length).toBe(0);
    expect((await db.db.select().from(mail).where(eq(mail.uid, report.uid)))[0]!.contents).toEqual(
      report.contents,
    );
    expect((await db.db.select().from(mail)).length).toBe(2);
  } finally {
    await db.close();
    await h.close();
  }
}, 120000);

test("legacy scout adoption resumes only owned reservations and never reissues a returning report", async () => {
  const h = await scoutHarness();
  try {
    await h.scout({ soldiers: sfs.object({ "107000": sfs.int(10) }) });
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!.food;
    const outbound = await checkpoint(h);
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, outbound.id));
    const legacy = await unregisteredWorldMarches(h.db.db);
    expect(legacy).toEqual([{ id: outbound.id, owner: "owner" }]);
    await h.tick();
    expect((await checkpoint(h)).version).toBe(1);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.food,
    ).toBe(before);
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    const returning = await checkpoint(h);
    expect((await h.db.db.select().from(mail)).length).toBe(2);
    await h.db.db.delete(world_march_checkpoint).where(eq(world_march_checkpoint.id, returning.id));
    await h.tick();
    expect(decode((await checkpoint(h)).payload).phase!.value).toBe("returning");
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect((await h.db.db.select().from(mail)).length).toBe(2);
    expect(
      (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0],
    ).toMatchObject({ free: 100, march: 0 });
    expect(
      (await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner")))[0]!.detectNum,
    ).toBe(1);
  } finally {
    await h.close();
  }
}, 120000);

test("occupied resources and camps expose their factual reserved defenders without changing the occupancy", async () => {
  const h = await scoutHarness();
  try {
    await h.db.db.update(user_army).set({ free: 40, march: 2 }).where(eq(user_army.uid, "other"));
    for (const kind of [3, 2]) {
      const id = `other-occupy-${kind}`;
      await h.db.db.insert(world_march).values({
        uuid: id,
        ownerUid: "other",
        ownerId: 1220,
        targetId: 10,
        targetType: kind,
        type: 0,
        state: 1,
        worldId: 0,
        marchStartTime: BigInt(h.clock.now),
        marchArrivalTime: BigInt(h.clock.now),
        arrivalTime: BigInt(h.clock.now),
        returnStartTime: 0n,
        marchTime: 1,
        armyInfo: encodeWorldMarchArmy({
          owner: "other",
          cachedLoad: 0,
          soldiers: [
            {
              owner: "other",
              armsId: "107000",
              total: 2,
              dead: 0,
              loadEffect: 0,
              basicArm: null,
              level: 3,
            },
          ],
          dragons: [],
          general: null,
        }),
      });
      await h.db.db
        .update(worldpoint)
        .set({
          pointType: kind,
          ownerId: "other",
          ownerMarchUUid: id,
          ownerName: "Synthetic",
          pointItem: kind === 3 ? "0" : null,
          resInitValue: 1000,
          resCostValue: 10,
        })
        .where(eq(worldpoint.id, 10));
      const before = (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0]!;
      await h.scout({ point: sfs.int(10), soldiers: sfs.object({ "107000": sfs.int(10) }) });
      expect(
        (await h.db.db.select().from(world_march).where(eq(world_march.ownerUid, "owner")))[0]!
          .targetType,
      ).toBe(kind);
      h.clock.now = Number((await checkpoint(h)).dueAt);
      await h.tick();
      const reports = await h.db.db.select().from(mail).where(eq(mail.type, 8));
      const report = JSON.parse(Buffer.from(reports.at(-1)!.contents).toString());
      const matching = reports
        .map((row) => JSON.parse(Buffer.from(row.contents).toString()))
        .find((row) => row.pointType === kind);
      expect(matching).toMatchObject({ pointId: 1220, pointType: kind, user: { pointId: 10 } });
      expect(matching.defence.arms[0].num).toBeLessThanOrEqual(2);
      expect(matching.defence.arms[0].star).toBe(3);
      expect(report).toBeDefined();
      h.clock.now = Number((await checkpoint(h)).dueAt);
      await h.tick();
      expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0]).toEqual(
        before,
      );
      expect(
        (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0],
      ).toMatchObject({ free: 100, march: 0 });
      expect(
        (await h.db.db.select().from(user_army).where(eq(user_army.uid, "other")))[0],
      ).toMatchObject({ free: 40, march: 2 });
      await h.db.db.delete(world_march).where(eq(world_march.uuid, id));
    }
    expect((await h.db.db.select().from(mail)).length).toBe(4);
  } finally {
    await h.close();
  }
}, 120000);

test("barbarian scouting uses its real resource fee and reports regenerated armies without granting their forecast", async () => {
  const h = await scoutHarness();
  try {
    await h.db.db.delete(user_building).where(eq(user_building.uuid, "owner-watchtower"));
    const rule = h.rules.world.barbarians!.get("4800000")!;
    const army = scoutPairs(h.rules.world.armies!.get(rule.army!)!.arm),
      awards = scoutPairs(rule.arm_reward);
    await h.db.db
      .update(worldpoint)
      .set({
        pointType: 44,
        pointItem: "4800000",
        ownerId: "",
        ownerMarchUUid: "",
        flushTime: BigInt(h.clock.now + 10000000),
      })
      .where(eq(worldpoint.id, 10));
    await h.db.db.insert(world_barbarion).values({
      pointId: 10,
      configId: "4800000",
      currentHP: Number(rule.para1),
      lastBeAttackedTime: 0n,
      lastArmyMapByteArray: encodeJavaIntMap(army),
      lastAwardArmyMapByteArray: encodeJavaIntMap(awards),
    });
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    const actor = (await h.db.db.select().from(world_barbarion))[0]!;
    await h.scout({ point: sfs.int(10) });
    const charged = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    expect(before.food - charged.food).toBe(BigInt(rule.para4!.split(";")[1]!));
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    const saved = (await h.db.db.select().from(mail).where(eq(mail.type, 8)))[0]!;
    const report = JSON.parse(Buffer.from(saved.contents).toString());
    expect(report.pointType).toBe(44);
    expect(report.barbarionCurrentDef).toBe(Number(rule.para1));
    expect(report.barbarionTotalArmyCount).toBe([...army.values()].reduce((a, b) => a + b, 0));
    expect(report.barbarionReward.length).toBe(awards.size);
    expect((await h.db.db.select().from(mail)).length).toBe(1);
    expect((await h.db.db.select().from(world_barbarion))[0]).toEqual(actor);
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect((await h.db.db.select().from(world_march)).length).toBe(0);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(before.wood);
    expect(
      (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!.gold,
    ).toBe(100000n);
  } finally {
    await h.close();
  }
}, 120000);

test("actual scout expenditure uses bound food first and breaks only the actor shield", async () => {
  const h = await scoutHarness();
  try {
    h.rules.power.statuses!.set("990010", { id: "990010", effect: "404;50" });
    h.rules.power.statuses!.set("990011", { id: "990011", effect: "61;1" });
    await h.db.db.insert(user_state).values([
      { uid: "owner", stateId: 990010, startTime: 0n, endTime: BigInt(h.clock.now + 10000000) },
      { uid: "owner", stateId: 990011, startTime: 0n, endTime: BigInt(h.clock.now + 10000000) },
    ]);
    await h.db.db
      .update(user_resource)
      .set({ foodbind: 1000n })
      .where(eq(user_resource.uid, "owner"));
    await h.db.db
      .update(worldpoint)
      .set({ shieldTime: BigInt(h.clock.now + 10000000) })
      .where(eq(worldpoint.id, 1202));
    const before = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    await h.scout();
    const after = (
      await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
    )[0]!;
    expect(after.food).toBe(before.food);
    expect(after.foodbind).toBe(750n);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1202)))[0]!.shieldTime,
    ).toBe(0n);
    expect(
      (await h.db.db.select().from(user_state).where(eq(user_state.uid, "owner"))).map(
        (row) => row.stateId,
      ),
    ).toEqual([990010]);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")))[0]!.food,
    ).toBe(1000000n);
  } finally {
    await h.close();
  }
}, 120000);

test("territory anti scout uses the nearest highest level allied turret and its actual active skill", async () => {
  const h = await scoutHarness();
  try {
    await h.db.db.insert(alliance).values({
      uid: "def-guild",
      alliancename: "Defenders",
      abbr: "DEF",
      createtime: 0n,
      bannerStyle: "",
    });
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "def-guild" })
      .where(eq(userprofile.uid, "other"));
    await h.db.db
      .update(worldpoint)
      .set({ territoryId: 1221, territoryAlliance: "def-guild" })
      .where(eq(worldpoint.id, 1220));
    await h.db.db.insert(alliance_territory).values([
      {
        uid: "lower-turret",
        pointId: 1221,
        atWorldId: 0,
        type: 20,
        level: 1,
        allianceId: "def-guild",
        allianceName: "Defenders",
      },
      {
        uid: "upper-turret",
        pointId: 1222,
        atWorldId: 0,
        type: 20,
        level: 2,
        allianceId: "def-guild",
        allianceName: "Defenders",
      },
    ]);
    await h.db.db.insert(alliance_skill).values({
      uuid: "lower-active",
      buildingUid: "lower-turret",
      skillId: "470007",
      effect: 62,
      effectValue: 1,
      startTime: 1n,
      endTime: BigInt(h.clock.now + 10000000),
    });
    await h.scout();
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect((await h.db.db.select().from(mail).where(eq(mail.type, 8))).length).toBe(1);
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    await h.db.db.insert(alliance_skill).values({
      uuid: "upper-active",
      buildingUid: "upper-turret",
      skillId: "470007",
      effect: 62,
      effectValue: 1,
      startTime: 1n,
      endTime: BigInt(h.clock.now + 10000000),
    });
    await h.scout();
    h.clock.now = Number((await checkpoint(h)).dueAt);
    await h.tick();
    expect((await h.db.db.select().from(mail).where(eq(mail.type, 8))).length).toBe(1);
    const failures = await h.db.db.select().from(mail).where(eq(mail.itemIdFlag, 1));
    expect(failures.length).toBe(2);
    expect(failures.find((row) => row.toUser === "owner")!.title).toBe(
      h.rules.mail.get("11746")!.title!,
    );
    expect(failures.find((row) => row.toUser === "other")!.title).toBe(
      h.rules.mail.get("11747")!.title!,
    );
  } finally {
    await h.close();
  }
}, 120000);
