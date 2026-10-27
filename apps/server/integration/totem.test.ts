import { test, expect } from "bun:test";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { totem_activation } from "@opencok/drizzle/schema/opencok_kingdom/totem_activation";
import { totem_delivery } from "@opencok/drizzle/schema/opencok_kingdom/totem_delivery";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { building_production } from "@opencok/drizzle/schema/opencok_kingdom/building_production";
import { createTotemDomain } from "@opencok/services/totem";
import { pendingTotemOwners } from "@opencok/repositories/totem";
import { sfs, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function fixture() {
  const h = await cityHarness([createTotemDomain(1200)], true);
  h.rules.features.set("totem_on", {
    id: "totem_on",
    online: "all",
    test: "all",
    version: "1.0.0",
  });
  const rule = h.rules.advanced.totems!.get("20015001")!;
  h.rules.advanced.totems!.set("20015001", {
    ...rule,
    take_effect_time: "1",
    minimum_time: "0",
    reduce_time: "0",
    cd_time: "2",
  });
  for (const [uid, point] of [
    ["owner", 1],
    ["other", 5],
  ] as const) {
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "friendly" })
      .where(eq(userprofile.uid, uid));
    await h.db.db
      .insert(user_world)
      .values({ uid, pointId: point, worldId: 0, color: 1, lastCityDefTime: 0n });
    await h.db.db.insert(worldpoint).values({
      id: point,
      worldId: 0,
      x: point - 1,
      y: 0,
      areaId: 0,
      gridType: 2,
      grid2Type: 0,
      pointType: 1,
      ownerId: uid,
      resLevel: 1,
      resInitValue: 0,
    });
    await h.db.db.insert(user_item).values({
      uuid: `${uid}-totem`,
      ownerId: uid,
      itemId: "211685",
      count: 1,
      value: 0,
      vanishTime: 0n,
    });
  }
  for (const point of [3, 8, 1440000])
    {await h.db.db.insert(worldpoint).values({
      id: point,
      worldId: 0,
      x: (point - 1) % 1200,
      y: Math.floor((point - 1) / 1200),
      areaId: 0,
      gridType: 2,
      grid2Type: 0,
      pointType: 0,
      resLevel: 0,
      resInitValue: 0,
    });}
  const command = (action: string, params: Fields = {}, owner = "owner") =>
    h.command(
      "totem",
      { M__REQUEST_ID__H: sfs.string(action), operationId: sfs.string(randomUUID()), ...params },
      owner,
    );
  const put = (point = 3, owner = "owner", operationId = sfs.string(randomUUID())) =>
    command(
      "put",
      { pointId: sfs.int(point), itemUUid: sfs.string(`${owner}-totem`), operationId },
      owner,
    );
  return { ...h, command, put };
}

test("totem activation and expiry survive duplicate calls and deliver status and mail once per player", async () => {
  const h = await fixture();
  try {
    const id = sfs.string(randomUUID());
    await Promise.all(Array.from({ length: 4 }, () => h.put(3, "owner", id)));
    expect((await h.db.db.select().from(totem_activation)).length).toBe(1);
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "owner-totem")))[0]!.count,
    ).toBe(1);
    await expect(h.put(8)).rejects.toThrow();
    await expect(h.command("remove", { pointId: sfs.int(3) }, "other")).rejects.toThrow();
    const [activation] = await h.db.db.select().from(totem_activation);
    h.clock.now = Number(activation!.dueAt) + 30000;
    expect(await pendingTotemOwners(h.db.db, BigInt(h.clock.now))).toEqual(["owner"]);
    await Promise.all([h.command("info", {}, "other"), h.command("info", {}, "owner")]);
    const states = await h.db.db.select().from(user_state).where(eq(user_state.stateId, 509213));
    expect(states.map((r) => r.uid).sort()).toEqual(["other", "owner"]);
    expect(
      states.every(
        (r) => r.startTime === activation!.dueAt && r.endTime === activation!.dueAt + 3600000n,
      ),
    ).toBe(true);
    const deliveries = await h.db.db.select().from(totem_delivery);
    expect(deliveries.length).toBe(2);
    expect(deliveries.every((row) => row.appliedAt > 0n)).toBe(true);
    expect((await h.db.db.select().from(totem_activation))[0]!.status).toBe(1);
    expect(
      (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 3)))[0]!.pointType,
    ).toBe(0);
    expect((await h.db.db.select().from(mail)).length).toBe(3);
    const outbox = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "totem.status"));
    expect(outbox.length).toBe(2);
    await h.command("info");
    await h.command("info", {}, "other");
    expect((await h.db.db.select().from(mail)).length).toBe(3);
    expect(await pendingTotemOwners(h.db.db, BigInt(h.clock.now))).toEqual([]);
  } finally {
    await h.close();
  }
}, 120000);

test("totem effects change production at the saved deadline before a late harvest", async () => {
  const h = await fixture();
  try {
    h.rules.power.statuses!.set("509213", {
      ...h.rules.power.statuses!.get("509213")!,
      effect: "53;10",
    });
    await h.db.db.insert(user_building).values({
      uid: "other",
      uuid: "other-farm",
      itemId: 415000,
      level: 1,
      pos: 20,
      refreshTime: BigInt(h.clock.now),
      opType: 0,
    });
    await h.command("info", {}, "other");
    await h.put();
    const [activation] = await h.db.db.select().from(totem_activation);
    h.clock.now = Number(activation!.dueAt) + 3600000 + 60000;
    await h.command("info", {}, "other");
    const [account] = await h.db.db
      .select()
      .from(building_production)
      .where(eq(building_production.buildingId, "other-farm"));
    expect(account).toBeDefined();
    expect(account!.settledAt).toBe(activation!.dueAt);
    expect(account!.rates).toContain(String(activation!.dueAt));
    expect(account!.rates).toContain(String(activation!.dueAt + 3600000n));
    const [state] = await h.db.db
      .select()
      .from(user_state)
      .where(and(eq(user_state.uid, "other"), eq(user_state.stateId, 509213)));
    expect(state!.startTime).toBe(activation!.dueAt);
    await h.production.command("other", "build.collect", {
      uuid: sfs.string("other-farm"),
      operationId: sfs.string(randomUUID()),
    });
    expect(
      (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "other")))[0]!.food,
    ).toBe(1000136n);
    const before = (
      await h.db.db
        .select()
        .from(building_production)
        .where(eq(building_production.buildingId, "other-farm"))
    )[0]!.amount;
    await h.command("info", {}, "other");
    expect(
      (
        await h.db.db
          .select()
          .from(building_production)
          .where(eq(building_production.buildingId, "other-farm"))
      )[0]!.amount,
    ).toBe(before);
  } finally {
    await h.close();
  }
}, 120000);

test("totem recycling preserves cooldown and never delivers an expired effect", async () => {
  const h = await fixture();
  try {
    await h.put();
    await h.command("remove", { pointId: sfs.int(3) });
    expect((await h.db.db.select().from(totem_activation))[0]!.status).toBe(2);
    await expect(h.put(8)).rejects.toThrow();
    h.clock.now += 120000;
    await h.put(1440000);
    h.clock.now += 120000;
    await h.command("info");
    expect((await h.db.db.select().from(totem_delivery)).length).toBe(0);
    expect((await h.db.db.select().from(mail)).length).toBe(3);
  } finally {
    await h.close();
  }
}, 120000);

test("consumable totems debit once and synchronize allied deadlines without accepting occupied tiles", async () => {
  const h = await fixture();
  try {
    h.rules.goods.set("211685", { ...h.rules.goods.get("211685")!, permanent_props: "0" });
    h.rules.advanced.totems!.set("20015001", {
      ...h.rules.advanced.totems!.get("20015001")!,
      take_effect_time: "60",
      minimum_time: "5",
      reduce_time: "5",
      enemy_state_id: "509214",
    });
    await expect(h.put(1)).rejects.toThrow();
    expect(
      (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "owner-totem")))[0]!.count,
    ).toBe(1);
    const id = sfs.string(randomUUID());
    await Promise.all(Array.from({ length: 4 }, () => h.put(3, "owner", id)));
    const [first] = await h.db.db.select().from(totem_activation);
    await h.put(8, "other");
    const active = await h.db.db.select().from(totem_activation);
    expect(active.length).toBe(2);
    expect(active.every((row) => row.dueAt === first!.dueAt - 300000n)).toBe(true);
    expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 3)))[0]!.fireTime).toBe(
      first!.dueAt - 300000n,
    );
    expect((await h.db.db.select().from(user_item)).every((row) => row.count === 0)).toBe(true);
    await h.db.db
      .update(userprofile)
      .set({ allianceId: "enemy" })
      .where(eq(userprofile.uid, "other"));
    h.clock.now = Number(first!.dueAt);
    await h.command("info", {}, "other");
    expect(
      (await h.db.db.select().from(user_state).where(eq(user_state.uid, "other"))).map(
        (row) => row.stateId,
      ),
    ).toEqual([509214]);
  } finally {
    await h.close();
  }
}, 120000);
