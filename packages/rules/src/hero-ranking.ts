import type { HeroRankingLookup, HeroSelfRanking } from "@opencok/contracts/hero-ranking";
import type { Row } from "@opencok/contracts/rows";
import type { Rules } from "./game.ts";
import { featureRealmEnabled, versionAtLeast } from "./availability.ts";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";

export function heroRankingLookup(
  event: Row,
  uid: string,
  allianceId: string,
  rules: Rules,
  realm: number,
  version: string,
): HeroRankingLookup | number {
  const type = Number(javaDecimal(String(event.type), 32));
  if (![1, 2, 3, 4].includes(type)) throw new Error("Unsupported hero event type");
  const alliance = type === 2 || type === 4;
  const gate = rules.items.get("heroactivity_on");
  try {
    if (
      !featureRealmEnabled(gate?.[alliance ? "k7" : "k3"], realm) ||
      !versionAtLeast(version, gate?.[alliance ? "k8" : "k4"] ?? "")
    )
      return -1;
  } catch {
    return -1;
  }
  if (alliance && mailBlank(allianceId)) return 0;
  const config = rules.items.get("heroactivity");
  const levels = alliance ? (config?.k1 ?? "").split("|").filter(Boolean).length : 40;
  if (levels < 1 || levels > 4096) throw new Error("Invalid hero ranking bands");
  const rankVersion = Number(BigInt.asIntN(32, javaDecimal(String(event.endTime), 64) / 1000n));
  let group: string;
  if (type === 3 || type === 4)
    group = event.serverGroup == null ? String(realm) : String(event.serverGroup);
  else {
    const bounds = (config?.k2 ?? "").split("|").filter(Boolean);
    if (!bounds.length || bounds.length > 4096) throw new Error("Missing hero realm bands");
    let range = 0;
    for (const bound of bounds) {
      if (realm <= Number(javaDecimal(bound, 32))) break;
      range++;
    }
    group = String(range);
  }
  if (!group || group.length > 255 || group.includes("\0"))
    throw new Error("Invalid hero ranking group");
  const prefix = [
    "",
    "HERO_PERSON_RANK",
    "HERO_ALLIANCE_RANK",
    "KINGDOM_PERSON_RANK",
    "KINGDOM_ALLIANCE_RANK",
  ][type];
  return {
    member: alliance ? allianceId : uid,
    keys: Array.from({ length: levels }, (_, i) => `${prefix}_${i}_${group}_${rankVersion}`),
  };
}

export function heroSelfRanking(
  events: readonly Row[],
  positions: readonly number[],
): HeroSelfRanking {
  if (events.length !== positions.length || events.length > 256)
    throw new Error("Invalid hero ranking snapshot");
  const result = { ranking: 0, rankingAlliance: 0, type: 1 };
  events.forEach((event, index) => {
    const rank = positions[index]!;
    if (!Number.isInteger(rank) || rank < -1 || rank > 5001)
      throw new Error("Invalid hero position");
    result.ranking = rank;
    result.type = Number(javaDecimal(String(event.type), 32));
    if (result.type === 4) result.rankingAlliance = rank;
  });
  return result;
}
