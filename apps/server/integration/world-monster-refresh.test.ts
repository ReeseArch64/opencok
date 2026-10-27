import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { world_barbarion_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion_dead";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createWorldMonsterRefreshExecutor } from "@opencok/repositories/world-monster-refresh";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { refreshWorldMonsters } from "@opencok/services/world-monster-refresh";
import { decodeJavaIntMap } from "@opencok/messages/java-int-map";
import { cityHarness } from "./support/city";
async function fixture(size = 4, fresh = false) {
  const h = await cityHarness([], false, undefined, size);
  try {
    await h.db.db.insert(server_info).values({ uid: "server", activityTime: 1n });
    if (fresh) {
      await h.db.db.delete(userprofile);
      await h.db.db.insert(trigger_var).values({
        type: -1,
        uid: "@world:0",
        key: "opencok.world.terrain.v1",
        value: JSON.stringify({ version: 1, kingdomId: 1, size, complete: true }),
      });
    }
    h.rules.items.set("monster", { ...h.rules.items.get("monster")!, k1: String(size) });
    h.rules.items.set("worldmap_explore", { k1: String(size), k2: "0", k3: "1", k4: "1", k6: "0" });
    h.rules.items.set("world_barbarion", { k2: String(size), k3: "0" });
    h.rules.items.set("worldmap_city", { ...h.rules.items.get("worldmap_city")!, k4: "1" });
    h.rules.items.set("function_on2", { k9: "0" });
    h.rules.world.fieldMonsterGroups = new Map([["refresh", [{ day: "0;999", para1: "9414;1" }]]]);
    h.rules.world.barbarians = new Map(
      Array.from({ length: size }, (_, band) => [
        String(band),
        {
          id: String(100 + band),
          area_level: String(band),
          ratio: "1",
          para1: "300",
          army: "synthetic",
          arm_reward: "1;3|2;7",
          life_time: ".1",
        },
      ]),
    );
    h.rules.world.armies!.set("synthetic", { arm: "1;13|2;17" });
    await h.db.db.insert(worldpoint).values(
      Array.from({ length: size * size }, (_, index) => ({
        id: index + 1,
        worldId: 0,
        x: index % size,
        y: Math.floor(index / size),
        areaId: 1,
        monsterAreaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: 0,
        ownerId: "",
        resLevel: 0,
        resInitValue: 0,
      })),
    );
    const executor = createWorldMonsterRefreshExecutor(h.db.db, h.authority, size);
    const run = (at: bigint) =>
      executor.execute(at, (store) =>
        refreshWorldMonsters(store, h.rules, size, (maximum) => maximum - 1),
      );
    const points = () => h.db.db.select().from(worldpoint).orderBy(worldpoint.id);
    const clock = async (family: string) => {
      const [row] = await h.db.db
        .select()
        .from(trigger_var)
        .where(eq(trigger_var.key, `opencok.world.monsters.${family}.v1`));
      return row ? JSON.parse(row.value) : undefined;
    };
    return { ...h, size, executor, run, points, clock };
  } catch (error) {
    await h.close();
    throw error;
  }
}
test("natural field supply uses bounded durable area progress across races, restart and exact period without clearing custom props", async () => {
  const h = await fixture(32, true);
  try {
    h.rules.world.fieldMonsterGroups!.set("refresh", [{ day: "0;999", para1: "9414;100" }]);
    await h.run(1000000n);
    expect((await h.points()).filter((row) => row.pointType === 9)).toHaveLength(64);
    expect((await h.clock("field")).remaining["9414"]).toBe(36);
    const recovered = createWorldMonsterRefreshExecutor(h.db.db, h.authority, h.size);
    await Promise.all(
      Array.from({ length: 3 }, () =>
        recovered.execute(1000000n, (store) =>
          refreshWorldMonsters(store, h.rules, h.size, () => 0),
        ),
      ),
    );
    const original = (await h.points()).filter((row) => row.pointType === 9);
    expect(original).toHaveLength(100);
    expect(
      original.every(
        (row) =>
          row.startTime === 1000000n &&
          row.flushTime === 87400000n &&
          row.monsterCurrHP === 0 &&
          row.flushFlag === 0,
      ),
    ).toBe(true);
    expect((await h.clock("field")).nextAt).toBe("11800000");
    await h.db.db
      .update(worldpoint)
      .set({ flushFlag: 1 })
      .where(eq(worldpoint.id, original[0]!.id));
    await h.run(11799999n);
    expect((await h.points()).filter((row) => row.pointType === 9)).toHaveLength(100);
    for (let index = 0; index < 5; index++) await h.run(11800000n);
    const after = (await h.points()).filter((row) => row.pointType === 9);
    expect(after).toHaveLength(101);
    expect(after.find((row) => row.id === original[0]!.id)!.startTime).toBe(1000000n);
    expect(
      after.filter((row) => row.flushFlag === 0).every((row) => row.startTime === 11800000n),
    ).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("monster expiry survives absent or future opening, isolates claimed footprints and clears only factual monster cells", async () => {
  const h = await fixture();
  try {
    await h.db.db.update(server_info).set({ activityTime: 0n });
    await h.db.db
      .update(worldpoint)
      .set({
        pointType: 9,
        pointItem: "9414",
        flushTime: 10n,
        monsterCurrHP: 25,
        monsterInfo: Buffer.from("7"),
      })
      .where(eq(worldpoint.id, 1));
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 15, pointItem: "9414", flushTime: 10n })
      .where(eq(worldpoint.id, 2));
    await h.db.db.insert(world_march).values({
      uuid: "factual",
      ownerUid: "other",
      ownerId: 6,
      type: 0,
      targetId: 2,
      marchStartTime: 0n,
      worldId: 0,
    });
    await h.run(1000n);
    expect((await h.points())[0]).toMatchObject({ pointType: 9, monsterCurrHP: 25 });
    expect((await h.points())[1]!.pointType).toBe(15);
    expect(await h.clock("field")).toBeUndefined();
    expect(await h.clock("barbarian")).toBeUndefined();
    await h.db.db.delete(world_march);
    await h.db.db.update(server_info).set({ activityTime: 999999n });
    await h.run(1001n);
    expect(
      (await h.points())
        .slice(0, 2)
        .every((row) => row.pointType === 0 && row.monsterCurrHP === 0 && row.monsterInfo === null),
    ).toBe(true);
    expect(await h.clock("field")).toBeUndefined();
    expect(await h.clock("barbarian")).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
test("exploration fresh supply keeps Source range TTL quirk and expired main replaces within the same area", async () => {
  const h = await fixture(4, true);
  try {
    h.rules.world.fieldMonsterGroups!.set("refresh", [{ day: "0;999" }]);
    h.rules.items.set("worldmap_explore", { k1: "4", k2: "1", k3: "1", k4: "1", k6: "16" });
    const now = 100000000n;
    await h.run(now);
    const before = await h.points(),
      main = before.find((row) => row.pointType === 6)!;
    expect(main).toMatchObject({ id: 16, startTime: now, flushTime: now + 3600000n });
    expect(
      before.filter((row) => row.pointType === 7).every((row) => row.flushTime === 3600000n),
    ).toBe(true);
    await h.run(now + 1n);
    expect((await h.points()).filter((row) => row.pointType === 7)).toHaveLength(0);
    await h.run(now + 3600005n);
    const after = await h.points(),
      replacement = after.find((row) => row.pointType === 6)!;
    expect(replacement.id).not.toBe(main.id);
    expect(after.find((row) => row.id === main.id)!.pointType).toBe(0);
    expect(after.filter((row) => row.pointType === 7)).toHaveLength(3);
    expect(
      after
        .filter((row) => [6, 7].includes(row.pointType))
        .every((row) => row.flushTime === now + 7200005n),
    ).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("barbarian supply creates real four-row actors and exact Java counters, then expires into delayed tickets without combat rewards", async () => {
  const h = await fixture();
  try {
    h.rules.features.set("barbarion_switch", {
      id: "barbarion_switch",
      version: "1.0.0",
      online: "all",
      test: "all",
    });
    h.rules.items.set("world_barbarion", { k2: "4", k3: "6.25" });
    await h.run(1000000n);
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(0);
    await h.run(2200000n);
    const actors = await h.db.db.select().from(world_barbarion),
      points = await h.points();
    expect(actors).toHaveLength(4);
    expect(points.filter((row) => row.pointType === 44)).toHaveLength(1);
    expect(points.filter((row) => row.pointType === 45)).toHaveLength(3);
    expect(actors.every((row) => row.currentHP === 300 && row.lastBeAttackedTime === 0n)).toBe(
      true,
    );
    expect(decodeJavaIntMap(actors[0]!.lastArmyMapByteArray!)).toEqual(
      new Map([
        ["1", 13],
        ["2", 17],
      ]),
    );
    expect(decodeJavaIntMap(actors[0]!.lastAwardArmyMapByteArray!)).toEqual(
      new Map([
        ["1", 3],
        ["2", 7],
      ]),
    );
    expect(
      points
        .filter((row) => [44, 45].includes(row.pointType))
        .every((row) => row.flushTime === 2560000n && row.resLevel === 0),
    ).toBe(true);
    const profiles = await h.db.db.select().from(userprofile);
    await h.db.db.update(server_info).set({ activityTime: 0n });
    await h.run(2560001n);
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(0);
    const tickets = await h.db.db.select().from(world_barbarion_dead);
    expect(tickets).toHaveLength(4);
    expect(tickets.every((row) => row.deadFinishTime === 6160001n)).toBe(true);
    expect((await h.points()).every((row) => row.pointType === 0)).toBe(true);
    expect(await h.db.db.select().from(userprofile)).toEqual(profiles);
  } finally {
    await h.close();
  }
}, 120000);
test("barbarian claimed expiry postpones all four cells and feature closure prevents new supply", async () => {
  const h = await fixture();
  try {
    for (const id of [11, 12, 15, 16])
      await h.db.db
        .update(worldpoint)
        .set({ pointType: id === 16 ? 44 : 45, pointItem: "102", flushTime: 10n })
        .where(eq(worldpoint.id, id));
    await h.db.db.insert(world_march).values({
      uuid: "factual",
      ownerUid: "other",
      ownerId: 6,
      type: 0,
      targetId: 16,
      marchStartTime: 0n,
      worldId: 0,
    });
    await h.run(1000n);
    expect(
      (await h.points())
        .filter((row) => [44, 45].includes(row.pointType))
        .every((row) => row.flushTime === 3600010n),
    ).toBe(true);
    expect(await h.db.db.select().from(world_barbarion_dead)).toHaveLength(0);
    await h.run(1201000n);
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(0);
    expect((await h.points()).filter((row) => row.pointType === 44)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("clock and actor changes roll back with outbox failure and owner loss, then one retry commits", async () => {
  const h = await fixture(4, true);
  try {
    await h.db.pool.query(
      "CREATE FUNCTION reject_monster_refresh() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic monster outbox failure'; END $$",
    );
    await h.db.pool.query(
      "CREATE TRIGGER reject_monster_refresh BEFORE INSERT ON opencok_kingdom.mutation_outbox FOR EACH ROW EXECUTE FUNCTION reject_monster_refresh()",
    );
    await expect(h.run(1000000n)).rejects.toThrow();
    expect((await h.points()).every((row) => row.pointType === 0)).toBe(true);
    expect(await h.clock("field")).toBeUndefined();
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.db.pool.query("DROP TRIGGER reject_monster_refresh ON opencok_kingdom.mutation_outbox");
    const current = await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.run(1000000n)).rejects.toThrow();
    const recovered = createWorldMonsterRefreshExecutor(h.db.db, current, 4);
    await recovered.execute(1000000n, (store) => refreshWorldMonsters(store, h.rules, 4, () => 0));
    expect((await h.points()).filter((row) => row.pointType === 9)).toHaveLength(1);
    expect((await h.clock("field")).epoch).toBe(String(current.epoch));
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("the worker captures its clock after the world lock and rejects corrupted persisted progress", async () => {
  const h = await fixture();
  try {
    let current = 1000,
      observed = 0n,
      started!: () => void;
    const locked = new Promise<void>((resolve) => {
      started = resolve;
    });
    let release!: () => void;
    const hold = new Promise<void>((resolve) => {
      release = resolve;
    });
    const lock = h.db.db.transaction(async (tx) => {
      const { sql } = await import("drizzle-orm");
      await tx.execute(sql`select pg_advisory_xact_lock(728214,0)`);
      started();
      await hold;
    });
    await locked;
    const executor = createWorldMonsterRefreshExecutor(h.db.db, h.authority, 4, () => current);
    const pending = executor.execute(undefined, async (store) => {
      observed = store.now;
    });
    await Bun.sleep(30);
    current = 2000;
    release();
    await lock;
    await pending;
    expect(observed).toBe(2000n);
    await h.run(1000000n);
    const before = await h.points();
    await h.db.db
      .update(trigger_var)
      .set({ value: "{}" })
      .where(eq(trigger_var.key, "opencok.world.monsters.field.v1"));
    await expect(h.run(2000000n)).rejects.toThrow("Invalid monster clock");
    expect(await h.points()).toEqual(before);
  } finally {
    await h.close();
  }
}, 120000);
test("fresh barbarian initialization checkpoints reserved candidates and emits each Source delayed ticket once across restart", async () => {
  const h = await fixture(16, true);
  try {
    h.rules.world.fieldMonsterGroups!.set("refresh", [{ day: "0;999" }]);
    h.rules.items.set("world_barbarion", { k2: "16", k3: "15" });
    await h.run(1000000n);
    expect(await h.db.db.select().from(world_barbarion_dead)).toHaveLength(128);
    expect((await h.clock("barbarian")).stage).toBe("seed");
    expect((await h.clock("barbarian")).attempts).toBe(6);
    const recovered = createWorldMonsterRefreshExecutor(h.db.db, h.authority, 16);
    await Promise.all(
      Array.from({ length: 3 }, () =>
        recovered.execute(1000000n, (store) =>
          refreshWorldMonsters(store, h.rules, 16, (maximum) => maximum - 1),
        ),
      ),
    );
    const tickets = await h.db.db.select().from(world_barbarion_dead);
    expect(tickets).toHaveLength(152);
    expect(new Set(tickets.map((row) => row.id)).size).toBe(152);
    expect(tickets.every((row) => row.pointItem === "0" && row.deadFinishTime === 4600000n)).toBe(
      true,
    );
    expect((await h.clock("barbarian")).stage).toBe("idle");
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(0);
    expect((await h.points()).every((row) => row.pointType === 0)).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("due barbarian tickets retry on occupied terrain, preserve foreign ownership and create exactly one configured actor footprint when freed", async () => {
  const h = await fixture();
  try {
    h.rules.features.set("barbarion_switch", {
      id: "barbarion_switch",
      version: "1.0.0",
      online: "all",
      test: "all",
    });
    h.rules.items.set("world_barbarion", { k2: "4", k3: "6.25" });
    await h.db.db.update(worldpoint).set({ ownerId: "other" });
    await h.db.db
      .insert(world_barbarion_dead)
      .values({ id: "synthetic-ticket", areaId: 1, level: 0, pointItem: "0", deadFinishTime: 1n });
    await h.run(1000000n);
    await h.run(2200000n);
    expect((await h.db.db.select().from(world_barbarion_dead))[0]!.deadFinishTime).toBe(5800000n);
    expect((await h.points()).every((row) => row.ownerId === "other" && row.pointType === 0)).toBe(
      true,
    );
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(0);
    await h.db.db.update(worldpoint).set({ ownerId: "" });
    await Promise.all(Array.from({ length: 3 }, () => h.run(5800001n)));
    expect(await h.db.db.select().from(world_barbarion_dead)).toHaveLength(0);
    expect(await h.db.db.select().from(world_barbarion)).toHaveLength(4);
    expect((await h.points()).filter((row) => row.pointType === 44)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("black-land supply uses neutral terrain, exact native boss ranges and independent clock without touching reserved tiles", async () => {
  const h = await cityHarness([], false, undefined, 1201);
  try {
    await h.db.db.insert(server_info).values({ uid: "server", activityTime: 1n });
    h.rules.world.fieldMonsterGroups = new Map([
      ["refresh", [{ day: "0;999", blackland1: "9414;2" }]],
    ]);
    h.rules.items.set("monster_event_config", { k1: "0", k6: "0" });
    h.rules.world.fieldMonsters!.set("9414", {
      ...h.rules.world.fieldMonsters!.get("9414")!,
      num: "4",
      boss: "1",
    });
    const reserved = 1 + 600 + 600 * 1201;
    await h.db.db.insert(worldpoint).values(
      [
        reserved,
        ...[575, 576, 578, 579].flatMap((x) => [575, 576].map((y) => 1 + x + y * 1201)),
      ].map((id) => ({
        id,
        worldId: 0,
        areaId: 1,
        x: (id - 1) % 1201,
        y: Math.floor((id - 1) / 1201),
        gridType: 0,
        grid2Type: 0,
        pointType: id === reserved ? 10 : 0,
        ownerId: "",
        resLevel: 0,
        resInitValue: 0,
      })),
    );
    const executor = createWorldMonsterRefreshExecutor(h.db.db, h.authority, 1201),
      run = (at: bigint) =>
        executor.execute(at, (store) =>
          refreshWorldMonsters(store, h.rules, 1201, (maximum) => maximum - 1),
        );
    await run(1000000n);
    expect(
      (await h.db.db.select().from(worldpoint)).every((row) => [0, 10].includes(row.pointType)),
    ).toBe(true);
    await run(1060000n);
    const after = await h.db.db.select().from(worldpoint);
    expect(after.filter((row) => row.pointType === 15)).toHaveLength(2);
    expect(after.filter((row) => row.pointType === 17)).toHaveLength(6);
    expect(after.find((row) => row.id === reserved)!.pointType).toBe(10);
    expect(
      after
        .filter((row) => row.pointType !== 10)
        .every((row) => row.flushTime === 87460000n && row.monsterCurrHP === 0),
    ).toBe(true);
  } finally {
    await h.close();
  }
}, 120000);
test("natural refresh preserves a complete imported boss footprint when only a range has a foreign owner", async () => {
  const h = await fixture(4, true);
  try {
    h.rules.world.fieldMonsters!.set("9414", {
      ...h.rules.world.fieldMonsters!.get("9414")!,
      num: "4",
      boss: "1",
    });
    await h.run(1000000n);
    const main = (await h.points()).find((row) => row.pointType === 15)!;
    expect(main.id).toBe(16);
    await h.db.db.update(worldpoint).set({ ownerId: "other" }).where(eq(worldpoint.id, 11));
    const before = await h.points();
    await h.run(11800000n);
    expect(await h.points()).toEqual(before);
    expect((await h.clock("field")).nextAt).toBe("22600000");
    expect((await h.points()).filter((row) => row.pointType === 15)).toHaveLength(1);
  } finally {
    await h.close();
  }
}, 120000);
test("expiry checkpoints advance beyond a protected page and resume without starving later monsters", async () => {
  const h = await fixture(16);
  try {
    await h.db.db.update(server_info).set({ activityTime: 0n });
    for (let id = 1; id <= 65; id++)
      await h.db.db
        .update(worldpoint)
        .set({ pointType: 9, pointItem: "9414", flushTime: 10n, ownerId: id <= 64 ? "other" : "" })
        .where(eq(worldpoint.id, id));
    await h.run(1099511627776n);
    expect((await h.points())[64]!.pointType).toBe(9);
    expect((await h.clock("expiry")).area).toBe(64);
    const recovered = createWorldMonsterRefreshExecutor(h.db.db, h.authority, 16);
    await recovered.execute(1099511627776n, (store) =>
      refreshWorldMonsters(store, h.rules, 16, () => 0),
    );
    expect((await h.points())[64]!.pointType).toBe(0);
    expect(
      (await h.points())
        .slice(0, 64)
        .every((row) => row.pointType === 9 && row.ownerId === "other"),
    ).toBe(true);
    expect((await h.clock("expiry")).area).toBe(65);
    expect(await h.clock("field")).toBeUndefined();
  } finally {
    await h.close();
  }
}, 120000);
