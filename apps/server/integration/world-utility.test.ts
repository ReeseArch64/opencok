import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_interest } from "@opencok/drizzle/schema/opencok_kingdom/world_interest";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { alliance_territory } from "@opencok/drizzle/schema/opencok_kingdom/alliance_territory";
import { createWorldUtilityStore } from "@opencok/repositories/world-utility";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, Type, decode, encode, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function utilityHarness() {
  const h = await cityHarness();
  await h.db.db.insert(user_world).values([
    { uid: "owner", pointId: 211, worldId: 0, lastCityDefTime: 0n },
    { uid: "other", pointId: 99, worldId: 0, lastCityDefTime: 0n },
  ]);
  const service = new GameService(
    {} as GameStore,
    h.rules,
    { kingdomId: 1, mapSize: 20 },
    () => h.clock.now,
    { worldUtility: createWorldUtilityStore(h.db.db, h.authority, 20) },
  );
  return { ...h, service };
}

test("native nearest-point and leave commands validate resident ownership and retain other viewport subscriptions", async () => {
  const h = await utilityHarness();
  try {
    for (const id of [169, 170, 189, 190])
      await h.db.db.insert(worldpoint).values({
        id,
        worldId: 0,
        x: (id - 1) % 20,
        y: Math.floor((id - 1) / 20),
        areaId: 1,
        gridType: 2,
        grid2Type: 0,
        pointType: 0,
        resLevel: 0,
        resInitValue: 0,
      });
    const find = (point = 211) =>
      h.service.execute("owner", "point.nearest.find", { point: sfs.int(point) });
    const nearest = decode(encode((await find()).body));
    expect(Object.keys(nearest)).toEqual(["point"]);
    expect(nearest.point!.type).toBe(Type.Int);
    expect(nearest.point!.value).toBe(190);
    await h.db.db.update(worldpoint).set({ ownerId: "foreign" }).where(eq(worldpoint.id, 169));
    expect((await find()).body.point!.value).toBe(0);
    expect((await find(0)).body.point!.value).toBe(0);
    await expect(find(401)).rejects.toThrow();
    await expect(
      h.service.execute("owner", "point.nearest.find", {
        point: sfs.int(211),
        serverId: sfs.int(2),
      }),
    ).rejects.toThrow();
    await h.db.db.insert(world_interest).values([
      { ownerUid: "owner", worldId: 0, x: 10, y: 10, updatedAt: 1000000n },
      { ownerUid: "other", worldId: 0, x: 9, y: 4, updatedAt: 1000000n },
    ]);
    await h.service.execute("owner", "world.leave", {});
    await h.service.execute("owner", "world.leave", {});
    expect((await h.db.db.select().from(world_interest)).map((row) => row.ownerUid)).toEqual([
      "other",
    ]);
    await h.db.db.update(user_world).set({ worldId: 3 }).where(eq(user_world.uid, "owner"));
    await expect(find()).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);

test("alliance map coordinates preserve native field order and expose only the owner's current alliance", async () => {
  const h = await utilityHarness();
  try {
    await h.db.db.update(userprofile).set({ allianceId: "A" }).where(eq(userprofile.uid, "owner"));
    await h.db.db.insert(user_world).values([
      { uid: "mate", pointId: 76, worldId: 0, lastCityDefTime: 0n },
      { uid: "outsider", pointId: 55, worldId: 0, lastCityDefTime: 0n },
    ]);
    await h.db.db.insert(alliance_member).values([
      { uid: "owner", allianceId: "A", rank: 1 },
      { uid: "other", allianceId: "A", rank: 5 },
      { uid: "mate", allianceId: "A", rank: 2 },
      { uid: "outsider", allianceId: "B", rank: 5 },
    ]);
    await h.db.db.insert(alliance_territory).values([
      { uid: "tower", allianceId: "A", allianceName: "A", type: 14, pointId: 84 },
      { uid: "resource", allianceId: "A", allianceName: "A", type: 18, pointId: 85 },
      { uid: "foreign", allianceId: "B", allianceName: "B", type: 14, pointId: 86 },
    ]);
    const command = () =>
      h.service.execute("owner", "world.al.leader.pt", { allianceId: sfs.string("B") });
    const body = decode(encode((await command()).body));
    expect(Object.keys(body)).toEqual(["pointId", "territoryPointId", "memberPointId"]);
    expect(body.pointId!.type).toBe(Type.Int);
    expect(body.pointId!.value).toBe(99);
    const members = body.memberPointId!.value as { value: Fields }[];
    expect(members).toHaveLength(1);
    const member = members[0]!.value;
    expect(Object.keys(member)).toEqual(["pointId", "allianceId", "worldId"]);
    expect(member.pointId!.value).toBe(76);
    expect(member.allianceId!.value).toBe("A");
    expect(member.worldId!.value).toBe(0);
    const territories = body.territoryPointId!.value as {
      value: Record<string, { value: unknown }>;
    }[];
    expect(territories).toHaveLength(1);
    expect(territories[0]!.value.pointId!.value).toBe(84);
    await h.db.db.update(userprofile).set({ allianceId: "" }).where(eq(userprofile.uid, "owner"));
    expect(Object.keys((await command()).body)).toEqual(["pointId"]);
    expect((await command()).body.pointId!.value).toBe(0);
    await h.db.db.update(userprofile).set({ banFlag: 1 }).where(eq(userprofile.uid, "owner"));
    await expect(command()).rejects.toThrow();
  } finally {
    await h.close();
  }
}, 120000);
