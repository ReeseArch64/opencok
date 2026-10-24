import type {
  BattleRankingState,
  PlayoffTeam,
  PlayoffPublication,
} from "@opencok/contracts/battle-ranking";
import type { Rules } from "./game.ts";
import { javaDecimal } from "./java-integer.ts";
import { featureRealmEnabled, versionAtLeast } from "./availability.ts";
import { serverFeature } from "./power-context.ts";
export function battleRankingOpen(
  rules: Rules,
  snapshot: BattleRankingState,
  realm: number,
  now: number,
  playoff: boolean,
  version: string,
): boolean {
  const days =
    Number(javaDecimal(rules.items.get("wa_info")?.k1 ?? "", 32)) +
    (playoff ? Number(javaDecimal(rules.items.get("wap_info")?.k1 ?? "", 32)) * 7 : 0);
  if (BigInt(now) - snapshot.openedAt < BigInt(days) * 86400000n) return false;
  if (playoff)
    return (
      serverFeature(rules, "wap_switch", {
        kingdomId: realm,
        now,
        version,
        testServer: [1, 4, 5, 6, 8, 10, 12, 14].includes(snapshot.realmType),
      }) && versionAtLeast(version, rules.features.get("wap_switch")?.version ?? "")
    );
  const gate = rules.items.get("wa_switch");
  return (
    gate?.k1 !== "0" &&
    featureRealmEnabled(gate?.k1?.trim(), realm) &&
    versionAtLeast(version, gate?.k2 ?? "")
  );
}
export function playoffPairs(
  teams: readonly PlayoffTeam[],
  turns: number,
  allianceId: string,
): PlayoffTeam[] {
  const groups = new Map<number, PlayoffTeam[]>();
  for (const team of teams) {
    const group = groups.get(team.groupId) ?? [];
    group.push(team);
    groups.set(team.groupId, group);
  }
  if (groups.size !== 8 || [...groups.values()].some((group) => group.length > 8))
    throw new Error("Incomplete playoff groups");
  const champions = [...groups]
    .sort(([a], [b]) => a - b)
    .map(([, group]) => {
      const winners = group.filter((team) =>
        team.results.slice(0, 3).every((result) => result === 1),
      );
      if (winners.length !== 1) throw new Error("Ambiguous playoff champion");
      return winners[0]!;
    })
    .sort((a, b) => (b.score - a.score) | 0);
  const pending = new Map(champions.map((team) => [team.teamId, team]));
  const pairs: PlayoffTeam[][] = [];
  for (const team of champions) {
    if (!pending.delete(team.teamId)) continue;
    const enemyId = team.curEnemyId ?? team.enemyIds[turns - 1] ?? "";
    const enemy = pending.get(enemyId);
    if (!enemy) throw new Error("Incomplete playoff pairing");
    pending.delete(enemyId);
    pairs.push([team, enemy]);
  }
  const own = pairs.findIndex((pair) => pair.some((team) => team.teamId === allianceId));
  if (own > 0) pairs.unshift(...pairs.splice(own, 1));
  return pairs.flat();
}
export function playoffTimes(
  publication: PlayoffPublication,
  self: PlayoffTeam | undefined,
  now: number,
): { endTime?: bigint; battleState?: number } {
  if (!self || publication.state <= 0) return {};
  if (![4, 5].includes(publication.state))
    return { endTime: BigInt.asIntN(64, publication.start + publication.duration) / 1000n };
  const hour = new Date(now).getUTCHours();
  const startHour = self.index * 2;
  const start =
    publication.state === 4
      ? BigInt.asIntN(64, publication.start + publication.duration)
      : publication.start;
  if (hour < startHour)
    return {
      battleState: 0,
      endTime: BigInt.asIntN(64, start + BigInt(startHour) * 3600000n) / 1000n,
    };
  if (hour < startHour + 2)
    return {
      battleState: 1,
      endTime: BigInt.asIntN(64, start + BigInt(startHour + 2) * 3600000n) / 1000n,
    };
  return { battleState: 2, endTime: 0n };
}
export function playoffBattleStart(now: number, weekday: number, index: number): bigint {
  if (!Number.isSafeInteger(now) || !Number.isInteger(weekday) || weekday < 1 || weekday > 7)
    throw new Error("Invalid playoff calendar");
  const date = new Date(now);
  const currentDay = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + weekday - currentDay);
  date.setUTCHours(index * 2, 0, 0, 0);
  return BigInt(date.getTime()) / 1000n;
}
