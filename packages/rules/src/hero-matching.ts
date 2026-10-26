import { createHash } from "node:crypto";
import type { HeroMatchRealm } from "@opencok/contracts/hero-matching";
import { cityInteger } from "./city-progression";
export function heroMatchIdentity(definition: string, start: bigint) {
  return createHash("sha256")
    .update(JSON.stringify([definition, start.toString()]))
    .digest("hex")
    .slice(0, 32);
}
export function heroMatchGroups(
  realms: readonly HeroMatchRealm[],
  groupSize: number,
  matchSize: number,
) {
  cityInteger(groupSize, 1, 128);
  cityInteger(matchSize, 1, Math.min(groupSize, 16));
  if (
    realms.length > 4096 ||
    new Set(realms.map((realm) => realm.kingdomId)).size !== realms.length
  )
    throw new Error("Invalid hero match cohort");
  for (const realm of realms) {
    cityInteger(realm.kingdomId, 1);
    cityInteger(realm.shuffle);
    if (realm.power < 0n) throw new Error("Invalid hero matching power");
  }
  const ordered = realms.toSorted((a, b) =>
      a.power > b.power ? -1 : a.power < b.power ? 1 : a.kingdomId - b.kingdomId,
    ),
    result: { kingdomId: number; serverGroup: string }[] = [];
  for (let offset = 0; offset < ordered.length; offset += groupSize) {
    const group = ordered
      .slice(offset, offset + groupSize)
      .toSorted((a, b) => a.shuffle - b.shuffle || a.kingdomId - b.kingdomId);
    for (let index = 0; index < group.length; index += matchSize) {
      const matched = group.slice(index, index + matchSize),
        serverGroup = matched.map((realm) => realm.kingdomId).join("|");
      for (const realm of matched) result.push({ kingdomId: realm.kingdomId, serverGroup });
    }
  }
  return result;
}
