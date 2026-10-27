import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_res_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_res_dead";
import { world_resource_runtime } from "@opencok/drizzle/schema/opencok_kingdom/world_resource_runtime";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { createWorldResourceRefreshExecutor } from "@opencok/repositories/world-resource-refresh";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { refreshWorldResources } from "@opencok/services/world-resource-refresh";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { cityHarness } from "./support/city";

async function resourceHarness(type = 0, size = 4) {
  const h = await cityHarness();
  await h.db.db.insert(server_info).values({ uid: "server", activityTime: 1n });
  const map = h.rules.items.get("worldmap_city")!;
  h.rules.items.set("worldmap_city", { ...map, k4: "1", k6: String(size), k7: "25" });
  const groups = new Map<string, Record<string, string>[]>();
  for (let group = 0; group < 4; group++)
    groups.set(
      group ? `resources${group}` : "resources",
      Array.from({ length: size }, (_, index) => ({
        id: String(index + 1),
        area_level: String(index),
        ratio: "1",
        res_type: String(type),
        res_level: "1",
        hours: "0",
      })),
    );
  h.rules.world.resources = groups;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      await h.db.db.insert(worldpoint).values({
        id: 1 + x + y * size,
        worldId: 0,
        x,
        y,
        areaId: 1,
        gridType: x === size - 1 && y === size - 1 ? 1 : 2,
        grid2Type: 0,
        pointType: x === 1 && y === 1 ? 1 : 0,
        ownerId: x === 1 && y === 1 ? "owner" : "",
        resLevel: 0,
        resInitValue: 0,
      });
  const executor = createWorldResourceRefreshExecutor(h.db.db, h.authority, size);
  const run = (at: bigint, effects = new Map<number, number>(), random = () => 0) =>
    executor.execute(at, (store) => refreshWorldResources(store, h.rules, size, effects, random));
  return { ...h, run, executor };
}

test("normal world resources initialize once, retain occupied nodes, expire into wait tickets and respawn durably", async () => {
  const h = await resourceHarness();
  try {
    const now = 1000000n;
    const effects = new Map([
      [305, 25],
      [307, 75],
    ]);
    await Promise.all(Array.from({ length: 4 }, () => h.run(now, effects)));
    const resources = () => h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3));
    const original = await resources();
    expect(original).toHaveLength(4);
    expect(original.every((row) => row.resInitValue === 70200)).toBe(true);
    const [clock] = await h.db.db.select().from(world_resource_runtime);
    expect(clock!.usedGroups).toBe("0");
    expect(clock!.nextRefreshAt).toBe(now + 1800000n);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(1);
    await h.run(now + 1n, new Map([[307, 1000]]));
    expect(await resources()).toEqual(original);
    const occupied = original[0]!;
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "owner", ownerMarchUUid: "march" })
      .where(eq(worldpoint.id, occupied.id));
    const expiry = now + 21600000n;
    await h.run(expiry);
    const retained = await resources();
    expect(retained).toHaveLength(1);
    expect(retained[0]!.id).toBe(occupied.id);
    expect(retained[0]!.resInitValue).toBe(70200);
    expect(retained[0]!.flushTime).toBe(expiry + 21600000n);
    const tickets = await h.db.db.select().from(world_res_dead);
    expect(tickets).toHaveLength(3);
    expect(tickets.every((row) => row.deadFinishTime === expiry + 3600000n)).toBe(true);
    const recovered = createWorldResourceRefreshExecutor(h.db.db, h.authority, 4);
    await recovered.execute(expiry + 3600000n, (store) =>
      refreshWorldResources(store, h.rules, 4, new Map(), () => 0),
    );
    const replenished = await resources();
    expect(replenished).toHaveLength(4);
    expect(
      replenished
        .filter((row) => row.id !== occupied.id)
        .every((row) => row.resInitValue === 35100),
    ).toBe(true);
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(0);
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[0]!.wood,
    ).toBe(1000000n);
    const pushes: string[] = [];
    for (const event of await h.db.db.select().from(mutation_outbox))
      await publishWorldMutation(
        event.payload,
        event.eventType,
        1,
        async () => ["", "owner"],
        async (owner, command) => {
          expect(owner).toBe("owner");
          pushes.push(command);
        },
      );
    expect(pushes.length).toBeGreaterThan(0);
    expect(pushes.every((command) => command === "push.world.point")).toBe(true);
    await acquireRealmAuthority(h.db.db, 1, () => true);
    await expect(h.run(expiry + 7200000n)).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("resource draws retain no-node tickets and group rotation without rerolling concurrent retries", async () => {
  const h = await resourceHarness(6);
  try {
    const now = 1000000n;
    await h.run(now);
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      0,
    );
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(4);
    for (let cycle = 1; cycle <= 3; cycle++) {
      await Promise.all(Array.from({ length: 3 }, () => h.run(now + BigInt(cycle) * 172800000n)));
      const [clock] = await h.db.db.select().from(world_resource_runtime);
      expect(clock!.usedGroups.split(",")).toHaveLength(cycle + 1);
      expect(new Set(clock!.usedGroups.split(",")).size).toBe(cycle + 1);
      expect(await h.db.db.select().from(world_res_dead)).toHaveLength(4);
    }
    await h.run(now + 4n * 172800000n);
    expect((await h.db.db.select().from(world_resource_runtime))[0]!.usedGroups).toBe("0");
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);

test("resource refresh rollback preserves terrain, waiting tickets, clock and notifications together", async () => {
  const h = await resourceHarness();
  try {
    await expect(
      h.executor.execute(1000000n, async (store) => {
        await refreshWorldResources(store, h.rules, 4, new Map(), () => 0);
        throw new Error("synthetic interruption");
      }),
    ).rejects.toThrow("synthetic interruption");
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      0,
    );
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(0);
    expect(await h.db.db.select().from(world_resource_runtime)).toHaveLength(0);
    expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
    await h.run(1000000n);
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      4,
    );
  } finally {
    await h.close();
  }
}, 120000);

test("resource catch-up bounds each page and retains blocked replacement tickets", async () => {
  const h = await resourceHarness(0, 20);
  try {
    const now = 1000000n;
    await h.run(now);
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      64,
    );
    expect((await h.db.db.select().from(world_resource_runtime))[0]!.nextRefreshAt).toBe(0n);
    await h.run(now);
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      100,
    );
    const expiry = now + 21600000n;
    await h.run(expiry);
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(64);
    expect((await h.db.db.select().from(world_resource_runtime))[0]!.nextRefreshAt).toBe(expiry);
    await h.run(expiry);
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(100);
    await h.db.db.update(worldpoint).set({ grid2Type: 1 }).where(eq(worldpoint.pointType, 0));
    await h.run(expiry + 3600000n);
    await h.run(expiry + 3600000n);
    const waiting = await h.db.db.select().from(world_res_dead);
    expect(waiting).toHaveLength(100);
    expect(waiting.every((row) => row.deadFinishTime === expiry + 7200000n)).toBe(true);
    expect(await h.db.db.select().from(worldpoint).where(eq(worldpoint.pointType, 3))).toHaveLength(
      0,
    );
  } finally {
    await h.close();
  }
}, 120000);
