import type { Rules } from "./game";
import type { HeroScoreAction } from "@opencok/contracts/hero-score";
import { cityInteger } from "./city-progression";
import { text, type Row } from "@opencok/contracts/rows";

export function heroScoreDelta(rules: Rules, event: Row, actions: readonly HeroScoreAction[]) {
  const definition = rules.ranking.heroEvents?.get(text(event, "eventId"));

  if (!definition) throw new Error("Missing hero score event definition");

  const points = new Map<string, bigint>();

  for (const id of (definition.score ?? "").split("|").filter(Boolean)) {
    const rule = rules.advanced.heroScores?.get(id);

    if (!rule) throw new Error("Missing hero score rule");

    const type = cityInteger(rule.type, 1, 9),
      value = BigInt(cityInteger(rule.points));

    for (const parameter of (rule.value || "0").split("|"))
      points.set(`${type}:${parameter}`, value);
  }

  return actions.reduce(
    (sum, action) => sum + (points.get(`${action.type}:${action.parameter}`) ?? 0n) * action.count,
    0n,
  );
}

export function heroScoreInteger(value: bigint) {
  if (value < -2147483648n || value > 2147483647n) throw new Error("Hero score overflow");

  return Number(value);
}
