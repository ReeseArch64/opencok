import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { world_res_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_res_dead";
import { black_land_res_dead } from "@opencok/drizzle/schema/opencok_kingdom/black_land_res_dead";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createWorldUseDomain } from "@opencok/services/world-use";
import { createWorldResourceRefreshExecutor } from "@opencok/repositories/world-resource-refresh";
import { refreshWorldResources } from "@opencok/services/world-resource-refresh";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { sfs, Type } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function useHarness() {
  const h = await cityHarness([createWorldUseDomain(4)]);
  await h.db.db
    .insert(user_world)
    .values({ uid: "owner", pointId: 6, worldId: 0, lastCityDefTime: 0n });
  await h.db.db.insert(worldpoint).values(
    Array.from({ length: 16 }, (_, index) => ({
      id: index + 1,
      worldId: 0,
      x: index % 4,
      y: Math.floor(index / 4),
      areaId: 1,
      pointType: index === 5 ? 1 : 0,
      ownerId: index === 5 ? "owner" : "",
      gridType: index === 0 ? 0 : index === 1 ? 1 : 2,
      grid2Type: 0,
      resLevel: 0,
      resInitValue: 0,
    })),
  );
  await h.db.db.insert(user_item).values([
    { uuid: "chosen", ownerId: "owner", itemId: "200060", count: 1, value: 0 },
    { uuid: "spare", ownerId: "owner", itemId: "200060", count: 2, value: 0 },
    { uuid: "foreign", ownerId: "other", itemId: "200060", count: 2, value: 0 },
    { uuid: "gold", ownerId: "owner", itemId: "200064", count: 1, value: 0 },
    { uuid: "wrong", ownerId: "owner", itemId: "200004", count: 1, value: 0 },
  ]);
  h.effects.world = async () =>
    new Map([
      [305, 1000],
      [307, 1000],
    ]);
  h.rules.goods.set("200060", { ...h.rules.goods.get("200060")!, para1: "110105", para2: "1" });
  h.rules.goods.set("200064", { ...h.rules.goods.get("200064")!, para1: "110253", para2: "1" });
  const use = (uuid: string, point: number, operationId?: string) =>
    h.command("world.use", {
      itemUUid: sfs.string(uuid),
      point: sfs.int(point),
      ...(operationId ? { operationId: sfs.string(operationId) } : {}),
    });
  return { ...h, use };
}

test("resource props debit the selected owned stack once and publish the native event only to other viewers", async () => {
  const h = await useHarness();
  try {
    const replies = await Promise.all(
      Array.from({ length: 4 }, () => h.use("chosen", 1, "prop-retry")),
    );
    expect(replies[0]!.body.pointId).toEqual(sfs.int(1));
    expect(replies[0]!.body.itemid).toEqual(sfs.string("200060"));
    const [point] = await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1));
    expect(point).toMatchObject({
      pointType: 3,
      pointItem: "0",
      resLevel: 5,
      resInitValue: 297000,
      resCostValue: 0,
      flushFlag: 1,
      flushTime: 65800000n,
    });
    const inventory = await h.db.db.select().from(user_item);
    expect(inventory.find((row) => row.uuid === "chosen")?.count ?? 0).toBe(0);
    expect(inventory.find((row) => row.uuid === "spare")!.count).toBe(2);
    expect(inventory.find((row) => row.uuid === "foreign")!.count).toBe(2);
    const pushes: string[] = [];
    for (const event of (await h.db.db.select().from(mutation_outbox)).filter(
      (row) => row.eventType === "world.use",
    ))
      await publishWorldMutation(
        event.payload,
        event.eventType,
        1,
        async () => ["owner", "other"],
        async (owner, command, body) => {
          if (command === "push.world.use") {
            pushes.push(owner);
            expect(Object.keys(body)).toEqual(["pointId", "itemid"]);
            expect(body.pointId!.type).toBe(Type.Int);
            expect(body.itemid!.type).toBe(Type.String);
          }
        },
      );
    expect(pushes).toEqual(["other"]);
    await h.use("spare", 2);
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 2)))[0]!.gridType).toBe(
      1,
    );
    await expect(h.use("foreign", 9)).rejects.toThrow();
    await expect(h.use("wrong", 9)).rejects.toThrow();
    await expect(h.use("spare", 1, randomUUID())).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "spare")))[0]!.count,
    ).toBe(1);
    await h.use("gold", 9);
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 9)))[0]).toMatchObject({
      pointType: 3,
      pointItem: "5",
      resLevel: 5,
      resInitValue: 74,
      flushFlag: 1,
    });
  } finally {
    await h.close();
  }
}, 120000);

test("expired resource props retain occupied nodes and clear without ordinary or black-land replacement tickets", async () => {
  const h = await useHarness();
  try {
    await h.db.db.insert(server_info).values({ uid: "server", activityTime: 1n });
    h.rules.items.set("worldmap_city", {
      ...h.rules.items.get("worldmap_city")!,
      k6: "4",
      k7: "0",
    });
    await h.use("chosen", 1);
    await h.use("spare", 2);
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "owner", ownerMarchUUid: "gathering" })
      .where(eq(worldpoint.id, 1));
    const executor = createWorldResourceRefreshExecutor(h.db.db, h.authority, 4),
      run = (now: bigint) =>
        executor.execute(now, (store) =>
          refreshWorldResources(
            store,
            h.rules,
            4,
            new Map([
              [305, 1000],
              [307, 1000],
            ]),
            () => 0,
          ),
        );
    await run(65800000n);
    const [occupied] = await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1));
    expect(occupied).toMatchObject({
      pointType: 3,
      resInitValue: 297000,
      flushFlag: 1,
      flushTime: 130600000n,
    });
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 2)))[0]).toMatchObject({
      pointType: 0,
      resInitValue: 0,
      flushFlag: 0,
    });
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(0);
    expect(await h.db.db.select().from(black_land_res_dead)).toHaveLength(0);
    await h.db.db
      .update(worldpoint)
      .set({ ownerId: "", ownerMarchUUid: "" })
      .where(eq(worldpoint.id, 1));
    await run(130600000n);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 1)))[0]!.pointType,
    ).toBe(0);
    expect(await h.db.db.select().from(world_res_dead)).toHaveLength(0);
  } finally {
    await h.close();
  }
}, 120000);
