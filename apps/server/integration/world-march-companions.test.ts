import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { dragonProgressionDomain } from "@opencok/services/dragon-progression";
import { generalsDomain } from "@opencok/services/generals";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { generalRecruit } from "@opencok/rules/general-progression";
import { decodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { new_general } from "@opencok/drizzle/schema/opencok_kingdom/new_general";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { cityHarness } from "./support/city";
async function fixture() {
  const h = await cityHarness([
    createWorldMarchDomain(1200),
    dragonProgressionDomain,
    generalsDomain,
  ]);
  for (const key of [
    "world_march",
    "dragon_new",
    "dragon_battle",
    "general_battle",
    "dragon_travel",
  ])
    h.rules.features.set(key, { id: key, version: "1.0.0", online: "all", test: "all" });
  h.rules.items.get("effect")!.k1 += "|55;2";
  await h.db.db
    .update(user_building)
    .set({ level: 19 })
    .where(eq(user_building.uuid, "owner-400000"));
  await h.db.db
    .insert(user_world)
    .values({ uid: "owner", pointId: 1, worldId: 0, color: 1, lastCityDefTime: 0n });
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
      pointType: [10, 20].includes(id) ? 3 : id === 1 ? 1 : [2, 1201, 1202].includes(id) ? 2 : 0,
      resLevel: 1,
      resInitValue: [10, 20].includes(id) ? 1000 : 0,
      resCostValue: 0,
      pointItem: [10, 20].includes(id) ? "0" : null,
      ownerId: [1, 2, 1201, 1202].includes(id) ? "owner" : "",
      ownerName: "Synthetic",
    });
  await h.db.db
    .insert(new_general)
    .values(
      generalRecruit(
        h.rules,
        53500,
        "owner",
        BigInt(h.clock.now),
      ) as typeof new_general.$inferInsert,
    );
  await h.db.db.insert(user_pet_dragon).values({
    uuid: "dragon",
    uid: "owner",
    itemId: 109000,
    dragonState: 3,
    lv: 10,
    useFlag: 1,
    friendly: 1000,
    initFriendShipFlag: 1,
  });
  const params = {
    point: sfs.int(10),
    type: sfs.int(0),
    soldiers: sfs.object({ "107000": sfs.int(10) }),
    petDragonUid: sfs.string("dragon"),
    generalId: sfs.string("53500"),
    heroUid: sfs.string(""),
  };
  const start = (extra: Fields = {}) => h.command("world.march", { ...params, ...extra });
  return { ...h, params, start };
}
test("gathering marches bind owned companions once, publish their native state and release them on recovered return", async () => {
  const h = await fixture();
  try {
    await h.command("world.march.check", h.params);
    expect((await h.db.db.select().from(new_general))[0]!.state).toBe(1);
    const operationId = sfs.string(randomUUID());
    const replies = await Promise.all(Array.from({ length: 4 }, () => h.start({ operationId })));
    expect(replies.every((reply) => fields(reply.body.petDragon).uuid!.value === "dragon")).toBe(
      true,
    );
    const [saved] = await h.db.db.select().from(world_march);
    const army = decodeWorldMarchArmy(saved!.armyInfo!);
    expect(army!.general).toEqual({ owner: "owner", id: 53500, level: 1 });
    expect(army!.dragons![0]).toEqual({
      owner: "owner",
      uuid: "dragon",
      itemId: 109000,
      level: 10,
    });
    expect((await h.db.db.select().from(new_general))[0]!.state).toBe(3);
    await expect(h.start({ point: sfs.int(20), generalId: sfs.string("") })).rejects.toThrow();
    await expect(h.start({ point: sfs.int(20), petDragonUid: sfs.string("") })).rejects.toThrow();
    await expect(
      h.command("petdragon.travel", { petDragonUid: sfs.string("dragon"), travelType: sfs.int(1) }),
    ).rejects.toThrow();
    await expect(
      h.command("newgeneral", {
        id: sfs.int(53500),
        M__REQUEST_ID__H: sfs.string("garrison"),
        buildinguuid: sfs.string("owner-413000"),
      }),
    ).rejects.toThrow();
    const [checkpoint] = await h.db.db.select().from(world_march_checkpoint);
    h.clock.now = Number(checkpoint!.dueAt) + 10000000;
    const returned = await h.command("world.user.march", {});
    expect(returned.body.m!.value).toEqual([]);
    expect((await h.db.db.select().from(new_general))[0]!.state).toBe(1);
    expect((await h.db.db.select().from(user_army))[0]!.free).toBe(100);
    const events = await h.db.db
      .select()
      .from(mutation_outbox)
      .where(eq(mutation_outbox.eventType, "world.user.march"));
    expect(events.length).toBe(1);
    const pushes: { owner: string; command: string; body: Fields }[] = [];
    await publishWorldMutation(
      events[0]!.payload,
      "world.user.march",
      1,
      async () => ["other"],
      async (owner, command, body) => {
        pushes.push({ owner, command, body });
      },
    );
    expect(pushes.filter((push) => push.command === "push.petdragon.march")).toEqual([
      {
        owner: "owner",
        command: "push.petdragon.march",
        body: { uuid: sfs.string("dragon"), inMarch: sfs.byte(0) },
      },
    ]);
    expect(
      pushes.some((push) => push.owner === "owner" && push.command === "push.general.info"),
    ).toBe(true);
    expect(
      pushes.some((push) => push.owner === "other" && push.command === "push.general.info"),
    ).toBe(false);
    await h.start({ point: sfs.int(20) });
    expect((await h.db.db.select().from(new_general))[0]!.state).toBe(3);
  } finally {
    await h.close();
  }
}, 120000);
test("companion eligibility rejects foreign, immature, traveling and stale idle bindings before reserving troops", async () => {
  const h = await fixture();
  try {
    await expect(h.start({ petDragonUid: sfs.string("foreign") })).rejects.toThrow();
    await h.db.db.update(user_pet_dragon).set({ lv: 9 });
    await expect(h.start()).rejects.toThrow();
    await h.db.db
      .update(user_pet_dragon)
      .set({ lv: 10, travelData: JSON.stringify({ travelState: 1 }) });
    await expect(h.start()).rejects.toThrow();
    await h.db.db.update(user_pet_dragon).set({ travelData: "" });
    await expect(h.start({ generalId: sfs.string("053500") })).rejects.toThrow();
    expect((await h.db.db.select().from(user_army))[0]!.free).toBe(100);
    await h.start({ petDragonUid: sfs.string("") });
    await h.db.db.update(new_general).set({ state: 1 });
    await expect(h.start({ point: sfs.int(20), petDragonUid: sfs.string("") })).rejects.toThrow();
    expect((await h.db.db.select().from(user_army))[0]!.free).toBe(90);
  } finally {
    await h.close();
  }
}, 120000);
test("failed march persistence rolls back companion assignment, troop reservation and notifications", async () => {
  const h = await fixture();
  try {
    await h.db.db.execute(
      sql`ALTER TABLE opencok_kingdom.world_march ADD CONSTRAINT synthetic_reject_march CHECK (false) NOT VALID`,
    );
    await expect(h.start()).rejects.toThrow();
    expect((await h.db.db.select().from(new_general))[0]!.state).toBe(1);
    expect((await h.db.db.select().from(user_army))[0]!.free).toBe(100);
    expect((await h.db.db.select().from(mutation_outbox)).length).toBe(0);
    expect((await h.db.db.select().from(world_march_checkpoint)).length).toBe(0);
  } finally {
    await h.close();
  }
}, 120000);
