import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { cityInteger } from "./city-progression";
import { serverFeature } from "./power-context";
import type { Rules, Rule } from "./game";
import type { RuleContext } from "./availability";

export function cycleFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function cycleField(name: string, page: number): string {
  cityInteger(page, 0, 2);

  return `${name}${page === 0 ? "" : page}`;
}

export function cycleOffers(rules: Rules, page: number, castle: number): readonly Rule[] {
  const all = [...(rules.advanced.exchangeCycles?.values() ?? [])].filter(
    (rule) => cityInteger(rule.page, 0, 2) === page,
  );

  if (all.length > 1024) {cycleFailure();}

  const ranged = all.map((rule) => {
    const limits = (rule.level ?? "").split(";").map((value) => cityInteger(value, 1));

    if (limits.length !== 2 || limits[1]! < limits[0]!) {cycleFailure();}

    return { rule, min: limits[0]!, max: limits[1]! };
  });
  const minimum = Math.min(...ranged.map((row) => row.min)),
    maximum = Math.max(...ranged.map((row) => row.max));
  const selected = Math.max(minimum, Math.min(maximum, castle)),
    stages = new Map<number, Rule>();

  for (const row of ranged)
    {if (row.min <= selected && selected <= row.max)
      {stages.set(cityInteger(row.rule.stage, 1, 7), row.rule);}}

  return [...stages].sort(([a], [b]) => a - b).map(([, rule]) => rule);
}

export function cycleDrawOpen(rules: Rules, page: number, context: RuleContext): boolean {
  return (
    serverFeature(rules, "luck_draw", context) &&
    !!rules.configuration.payControl?.get("69033")?.k3?.split(";").includes(String(page))
  );
}

export function cycleDrawChoice(
  rules: Rules,
  page: number,
  random: (maximum: number) => number,
): Rule {
  const choices = [...(rules.advanced.cycleDraws?.values() ?? [])].filter(
    (rule) => cityInteger(rule.type, 0, 2) === page,
  );

  if (!choices.length || choices.length > 1024) {cycleFailure();}

  const weights = choices.map((rule) => cityInteger(rule.rate ?? 0)),
    total = cityInteger(
      weights.reduce((sum, value) => sum + value, 0),
      1,
    ),
    draw = cityInteger(random(total), 0, total - 1);
  let sum = 0;

  for (const [index, weight] of weights.entries()) {
    sum += weight;

    if (draw < sum) {return choices[index]!;}
  }

  return cycleFailure();
}

export function cycleClaims(raw: string): string[] {
  if (raw.length > 255 || (raw && !/^\d+(;\d+)*;?$/.test(raw))) {cycleFailure();}

  return raw.split(";").filter(Boolean);
}

export function cycleBuffs(raw: string): Map<string, bigint> {
  if (raw.length > 1000) {cycleFailure();}

  const result = new Map<string, bigint>();

  for (const part of raw.split("|").filter(Boolean)) {
    const pair = part.split(":");

    if (pair.length !== 2 || !/^\d+$/.test(pair[0]!) || !/^\d+$/.test(pair[1]!)) {cycleFailure();}

    const deadline = BigInt(pair[1]!);

    if (deadline > 9223372036854775807n) {cycleFailure();}

    result.set(pair[0]!, deadline);
  }

  return result;
}
