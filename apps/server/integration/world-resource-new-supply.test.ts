import { expect, test } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { createDatabase } from "@opencok/drizzle";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_res_new_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_res_new_dead";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { createWorldResourceNewExecutor } from "@opencok/repositories/world-resource-new";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import {
  worldResourceNewFootprint,
  worldResourceNewIdentity,
} from "@opencok/rules/world-resource-new";
import { refreshWorldResourceNew } from "@opencok/services/world-resource-new";
import { cityHarness } from "./support/city";

const now = BigInt(Date.UTC(2030, 0, 1));
async function fixture() {
  const h = await cityHarness(),
    original = h.rules.items.get("on_event2")!;
  h.rules.items.set("worldmap_city", { ...h.rules.items.get("worldmap_city")!, k6: "5" });
  for (let y = 0; y < 5; y++)
    {for (let x = 0; x < 5; x++)
      {await h.db.db.insert(worldpoint).values({
        id: x + y * 5 + 1,
        worldId: 0,
        x,
        y,
        areaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: 0,
        resInitValue: 0,
        resLevel: 0,
        ownerId: "",
      });}}
  const executor = createWorldResourceNewExecutor(h.db.db, h.authority, 5, 1),
    run = (at: bigint) =>
      executor.execute(at, (store) => refreshWorldResourceNew(store, h.rules, 5, () => 0)),
    main = async () =>
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 37)))[0],
    open = () =>
      h.rules.items.set("on_event2", {
        ...original,
        k1: "1",
        k2: "1000",
        k8: "3600",
        k12: "2;3;5",
        k9: "2030-01-01-00-00",
        k10: "2030-01-03-00-00",
      }),
    resetClock = () =>
      h.db.db.delete(trigger_var).where(eq(trigger_var.key, worldResourceNewIdentity.key));
  return { ...h, run, executor, main, open, resetClock };
}

test("shared supply preserves closed catalogs and concurrent draws create one four-cell funded node and durable cursor", async () => {
  const h = await fixture();
  try {
    await h.run(now);
    expect(await h.main()).toBeUndefined();
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    h.open();
    await h.resetClock();
    await Promise.all(Array.from({ length: 4 }, () => h.run(now)));
    const main = (await h.main())!,
      nodes = await h.db.db
        .select()
        .from(worldpoint)
        .where(sql`${worldpoint.pointType} IN (37,38)`);
    expect(nodes).toHaveLength(4);
    expect(nodes.map((row) => row.id).sort((a, b) => a - b)).toEqual(
      worldResourceNewFootprint(main.id, 5).sort((a, b) => a - b),
    );
    expect(main).toMatchObject({
      pointItem: "1",
      resInitValue: 1000,
      resCostValue: 0,
      resLevel: 2,
      monsterCurrHP: 0,
      flushTime: now + 3600000n,
    });
    expect(nodes.filter((row) => row.pointType === 38)).toHaveLength(3);
    expect(nodes.every((row) => row.pointItem === "1" && row.resInitValue === 1000)).toBe(true);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(1);
    const [clock] = await h.db.db
      .select()
      .from(trigger_var)
      .where(eq(trigger_var.key, worldResourceNewIdentity.key));
    expect(JSON.parse(clock!.value)).toEqual({
      version: 1,
      areaCursor: 1,
      nextRefreshAt: String(now + 1800000n),
    });
    await h.run(now + 1n);
    expect(await h.main()).toEqual(main);
  } finally {
    await h.close();
  }
}, 60000);

test("shared expiry retains occupied footprints and recovers free replacement tickets through a new fenced pool", async () => {
  const h = await fixture();
  let fresh: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    h.open();
    await h.run(now);
    const main = (await h.main())!;
    await h.db.db.update(worldpoint).set({ monsterCurrHP: 1 }).where(eq(worldpoint.id, main.id));
    await h.run(now + 3600001n);
    expect((await h.main())!.flushTime).toBe(now + 7200000n);
    const ranges = await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 38));
    expect(ranges).toHaveLength(3);
    expect(ranges.every((row) => row.flushTime === now + 7200000n)).toBe(true);
    expect(await h.db.db.select().from(world_res_new_dead)).toHaveLength(0);
    await h.db.db
      .update(worldpoint)
      .set({ monsterCurrHP: 0, resCostValue: 1000 })
      .where(eq(worldpoint.id, main.id));
    await h.run(now + 7200001n);
    expect(await h.main()).toBeUndefined();
    expect(
      await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 38)),
    ).toHaveLength(0);
    expect(await h.db.db.select().from(world_res_new_dead)).toHaveLength(1);
    fresh = createDatabase("kingdom", h.connection);
    const authority = await acquireRealmAuthority(fresh.db, 1, () => true),
      next = createWorldResourceNewExecutor(fresh.db, authority, 5, 1);
    await next.execute(now + 9000002n, (store) =>
      refreshWorldResourceNew(store, h.rules, 5, () => 0),
    );
    expect(await h.main()).toMatchObject({ resInitValue: 1000, resCostValue: 0, monsterCurrHP: 0 });
    expect(await h.db.db.select().from(world_res_new_dead)).toHaveLength(0);
    await expect(h.run(now + 10000000n)).rejects.toThrow();
  } finally {
    await fresh?.close();
    await h.close();
  }
}, 60000);

test("shared supply rolls back every tile, cursor, ticket and publication if its transaction cannot finish", async () => {
  const h = await fixture();
  try {
    h.open();
    const before = await h.db.db.select().from(worldpoint);
    await expect(
      h.executor.execute(now, async (store) => {
        await refreshWorldResourceNew(store, h.rules, 5, () => 0);
        throw new Error("forced shared resource rollback");
      }),
    ).rejects.toThrow("forced shared resource rollback");
    expect(await h.db.db.select().from(worldpoint)).toEqual(before);
    expect(await h.db.db.select().from(world_res_new_dead)).toHaveLength(0);
    expect(
      await h.db.db
        .select()
        .from(trigger_var)
        .where(eq(trigger_var.key, worldResourceNewIdentity.key)),
    ).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.run(now);
    expect(await h.main()).toBeDefined();
  } finally {
    await h.close();
  }
}, 60000);

test("shared production captures its live clock after the world lock and lost live ownership preserves the realm", async () => {
  const h = await fixture();
  let release: (() => void) | undefined;
  try {
    h.open();
    let acquired: (() => void) | undefined;
    const held = new Promise<void>((resolve) => {
        acquired = resolve;
      }),
      unlocked = new Promise<void>((resolve) => {
        release = resolve;
      }),
      blocker = h.db.db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
        acquired!();
        await unlocked;
      });
    await held;
    let captures = 0;
    const executor = createWorldResourceNewExecutor(h.db.db, h.authority, 5, 1, () => {
        captures++;
        return Number(now) + 5000;
      }),
      pending = executor.execute(undefined, (store) =>
        refreshWorldResourceNew(store, h.rules, 5, () => 0),
      );
    await Bun.sleep(30);
    expect(captures).toBe(0);
    expect(await h.main()).toBeUndefined();
    release!();
    await blocker;
    await pending;
    expect(captures).toBe(1);
    expect((await h.main())!.flushTime).toBe(now + 3605000n);
    const before = await h.db.db.select().from(worldpoint),
      live = {
        ...h.authority,
        assertReady() {
          throw new Error("lost shared resource owner");
        },
      };
    await expect(
      createWorldResourceNewExecutor(h.db.db, live, 5, 1).execute(now + 9000000n, (store) =>
        refreshWorldResourceNew(store, h.rules, 5, () => 0),
      ),
    ).rejects.toThrow("lost shared resource owner");
    expect(await h.db.db.select().from(worldpoint)).toEqual(before);
  } finally {
    release?.();
    await h.close();
  }
}, 60000);

test("shared expiry respects incoming and unknown parties, activity-node quotas and unrelated orphan ownership", async () => {
  const h = await fixture();
  try {
    h.open();
    await h.run(now);
    const main = (await h.main())!;
    await h.db.db.insert(world_march).values({
      uuid: "incoming-shared",
      ownerUid: "owner",
      ownerId: 1,
      type: 0,
      targetId: main.id,
      targetType: 37,
      marchStartTime: now,
      state: 0,
      worldId: 0,
    });
    await h.run(now + 3600001n);
    expect((await h.main())!.flushTime).toBe(now + 7200000n);
    await h.db.db.delete(world_march);
    await h.db.db
      .update(worldpoint)
      .set({ pointItem: "7", flushFlag: 1 })
      .where(sql`${worldpoint.pointType} IN (37,38)`);
    await h.run(now + 7200001n);
    expect(await h.db.db.select().from(world_res_new_dead)).toHaveLength(0);
    expect((await h.main())!.pointItem).toBe("1");
    const [space, orphan] = await h.db.db
      .select()
      .from(worldpoint)
      .where(eq(worldpoint.pointType, 0))
      .limit(2);
    expect(space).toBeDefined();
    expect(orphan).toBeDefined();
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 38, flushTime: now, ownerId: "foreign" })
      .where(eq(worldpoint.id, space!.id));
    const foreign = (
      await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, space!.id))
    )[0]!;
    await h.db.db
      .update(worldpoint)
      .set({ pointType: 38, flushTime: now })
      .where(eq(worldpoint.id, orphan!.id));
    await h.resetClock();
    await h.run(now + 9000001n);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, space!.id)))[0],
    ).toEqual(foreign);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, orphan!.id)))[0]!.pointType,
    ).toBe(0);
  } finally {
    await h.close();
  }
}, 60000);
