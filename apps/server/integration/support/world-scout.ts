import { cityHarness } from "./city";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { seedSyntheticWorldBirth } from "./world-birth";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { CityDomain } from "@opencok/services/city-progression";

export async function scoutHarness(extra: readonly CityDomain[] = []) {
  const h = await cityHarness([createWorldMarchDomain(1200), ...extra]);
  for (const id of ["world_march", "mail_defence", "barbarion_switch", "glory_watchtower"])
    {h.rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });}
  await h.db.db.update(userprofile).set({ appVersion: "12.06.0" });
  await h.db.db.insert(user_world).values([
    { uid: "owner", pointId: 1202, worldId: 0, color: 1, lastCityDefTime: 0n },
    { uid: "other", pointId: 1220, worldId: 0, color: 2, lastCityDefTime: 0n },
  ]);
  await h.db.db.insert(user_army).values([
    { uid: "owner", armyId: "107000", level: 1, free: 100 },
    { uid: "other", armyId: "107000", level: 3, free: 42 },
  ]);
  await h.db.db.insert(user_building).values({
    uuid: "owner-watchtower",
    uid: "owner",
    itemId: 417000,
    pos: 8,
    level: 10,
    refreshTime: BigInt(h.clock.now),
  });
  for (const [id, owner] of [
    [1, "owner"],
    [2, "owner"],
    [1201, "owner"],
    [1202, "owner"],
    [19, "other"],
    [20, "other"],
    [1219, "other"],
    [1220, "other"],
    [10, ""],
  ] as const)
    {await h.db.db.insert(worldpoint).values({
      id,
      worldId: 0,
      x: (id - 1) % 1200,
      y: Math.floor((id - 1) / 1200),
      areaId: 0,
      gridType: 2,
      grid2Type: 0,
      pointType: id === 1202 || id === 1220 ? 1 : id === 10 ? 0 : 2,
      resLevel: 1,
      resInitValue: 0,
      resCostValue: 0,
      ownerId: owner,
      ownerName: owner ? "Synthetic" : "",
    });}
  await seedSyntheticWorldBirth(h.db.db, h.authority, h.rules);
  return {
    ...h,
    scout: (params: Fields = {}) =>
      h.command("world.march", { point: sfs.int(1220), type: sfs.int(1), ...params }),
    tick: () => h.command("world.tick", {}),
  };
}
