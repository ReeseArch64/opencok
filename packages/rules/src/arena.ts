import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rules } from "./game";
import { cityInteger } from "./city-progression";
export function arenaFailure(): never {
  throw new GameError(errors.unsupported, "city_progression");
}
export function arenaArmySelection(
  rules: Rules,
  raw: string,
  current: readonly { armyId: string; count: number }[],
) {
  const values = raw.split("|");
  if (!raw || values.length > 128) arenaFailure();
  const seen = new Set<string>(),
    selected = new Map(current.map((row) => [row.armyId, row.count]));
  for (const value of values) {
    const pair = value.split(";");
    if (pair.length !== 2 || seen.has(pair[0]!)) arenaFailure();
    const id = String(cityInteger(pair[0], 1)),
      count = cityInteger(pair[1]);
    if (pair[0] !== id || seen.has(id)) arenaFailure();
    const rule = rules.arms.get(id);
    if (!rule || !["1", "2", "3", "4"].includes(rule.arm ?? "")) arenaFailure();
    selected.set(id, count);
    seen.add(id);
  }
  const total = [...selected.values()].reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(total) || total > cityInteger(rules.items.get("fight_arena")?.k9, 1))
    arenaFailure();
  return [...selected]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([armyId, count]) => ({ armyId, count }));
}

export function arenaRankDelta(playerScore: number, teamTotal: number, won: boolean) {
  cityInteger(playerScore);
  cityInteger(teamTotal);
  if (playerScore > teamTotal) arenaFailure();
  const fraction =
    teamTotal > 0 ? Math.fround(Math.fround(playerScore) / Math.fround(teamTotal)) : 0;
  return Math.trunc(fraction) * (won ? 10 : 5);
}
