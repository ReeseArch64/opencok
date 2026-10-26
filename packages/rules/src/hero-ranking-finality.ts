import { createHash } from "node:crypto";
import type { HeroRankPeriod } from "@opencok/contracts/hero-ranking-finality";
import { cityInteger } from "./city-progression";
import { heroRankingLookup } from "./hero-ranking";
import { long, text, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
const prefixes = [
  "",
  "HERO_PERSON_RANK",
  "HERO_ALLIANCE_RANK",
  "KINGDOM_PERSON_RANK",
  "KINGDOM_ALLIANCE_RANK",
];
export function heroFinalityIdentity(type: number, group: string, endTime: bigint) {
  return createHash("sha256")
    .update(JSON.stringify([type, group, endTime.toString()]))
    .digest("hex")
    .slice(0, 32);
}
export function heroFinalRankKey(period: HeroRankPeriod, level: number) {
  cityInteger(period.type, 1, 4);
  cityInteger(level, 0, 4095);
  return `${prefixes[period.type]}_${level}_${period.group}_${BigInt.asIntN(32, period.endTime / 1000n)}`;
}
export function heroFinalityPeriod(
  event: Row,
  rules: Rules,
  configured: readonly number[],
): HeroRankPeriod | undefined {
  const type = cityInteger(event.type, 1, 4),
    endTime = long(event, "endTime");
  if (type >= 3 && !text(event, "serverGroup")) return;
  const groupFor = (realm: number) => {
    const query = heroRankingLookup(event, "member", "member", rules, realm, "12.06.0", false);
    if (typeof query === "number") throw new Error("Unavailable hero finality group");
    const group = query.keys[0]!.match(/_0_([0-9|]+)_-?\d+$/)?.[1];
    if (!group) throw new Error("Invalid hero finality rank group");
    return group;
  };
  const group = groupFor(rules.kingdomId),
    expectedRealms =
      type >= 3
        ? group.split("|").map((value) => cityInteger(value, 1))
        : configured.filter((realm) => groupFor(realm) === group).toSorted((a, b) => a - b);
  if (
    expectedRealms.length < 1 ||
    expectedRealms.length > 128 ||
    new Set(expectedRealms).size !== expectedRealms.length ||
    !expectedRealms.includes(rules.kingdomId) ||
    expectedRealms.some((realm) => !configured.includes(realm))
  )
    throw new Error("Invalid hero finality realm cohort");
  return {
    id: heroFinalityIdentity(type, group, endTime),
    type,
    eventId: text(event, "eventId"),
    endTime,
    group,
    expectedRealms,
  };
}
export function heroCountryOrder(group: string, totals: ReadonlyMap<number, bigint>) {
  const members = group.split("|").map((value) => cityInteger(value, 1));
  if (members.some((realm) => !totals.has(realm)))
    throw new Error("Incomplete hero kingdom score proof");
  return (
    members
      .map((realm, index) => ({ realm, index, score: totals.get(realm)! }))
      .toSorted((a, b) => (a.score > b.score ? -1 : a.score < b.score ? 1 : a.index - b.index))
      .map((row) => row.realm)
      .join("|") + "|"
  );
}
export const heroEmptyDigest = "d41d8cd98f00b204e9800998ecf8427e";
