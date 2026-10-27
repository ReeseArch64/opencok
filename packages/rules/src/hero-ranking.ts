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
  enforceGate = true,
): HeroRankingLookup | number {
  const type = Number(javaDecimal(String(event.type), 32));

  if (![1, 2, 3, 4].includes(type)) throw new Error("Unsupported hero event type");

  const alliance = type === 2 || type === 4;
  const gate = rules.items.get("heroactivity_on");

  try {
    if (
      enforceGate &&
      (!featureRealmEnabled(gate?.[alliance ? "k7" : "k3"], realm) ||
        !versionAtLeast(version, gate?.[alliance ? "k8" : "k4"] ?? ""))
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

export function heroHistoryBand(type: number, castle: number, power: bigint, rules: Rules): number {
  if (type === 1 || type === 3) return castle - 1;

  if (power <= 0n) return -1;

  const ranges = (rules.items.get("heroactivity")?.k1 ?? "").split("|");

  if (!ranges[0] || ranges.length > 4096) throw new Error("Missing hero power bands");

  const value = BigInt.asIntN(32, power / 1000n);
  const index = ranges.findIndex((raw) => value <= BigInt.asIntN(32, javaDecimal(raw, 64) / 1000n));

  return index < 0 ? ranges.length - 1 : index;
}

export function heroHistoryRewards(
  rules: Rules,
  eventId: string,
  band: number,
): readonly (string | undefined)[] {
  const event = rules.ranking.heroEvents?.get(eventId);

  if (!event) throw new Error("Missing hero event rules");

  const rows = (event.rankreward ?? "").split("|").map((row) => row.split(";"));
  const width = rows[0]?.length ?? 0;

  if (rows.length > 4096 || width > 4096 || !rows[band] || rows.some((row) => row.length > width))
    throw new Error("Invalid hero reward bands");

  const rewards = rows[band]!.map((raw) => String(javaDecimal(raw, 32)));

  while (rewards.length < width) rewards.push("0");

  const thresholds = (event.ranklist ?? "").split("|").map((raw) => Number(javaDecimal(raw, 32)));

  return Array.from({ length: 10 }, (_, i) => {
    const index = thresholds.findIndex((bound) => i + 1 <= bound);

    return index < 0 ? undefined : rewards[index];
  });
}
