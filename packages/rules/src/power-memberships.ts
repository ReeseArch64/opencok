import type { Row } from "@opencok/contracts/rows";
import type { Rule, Rules } from "./game.ts";

import {
  effectInteger as integer,
  effectFloat as float,
  effectLong as long,
  invalidEffect as invalid,
} from "./power-values.ts";

function pairs(source: string | undefined): [number, number][] {
  if (source === undefined) return invalid();

  return source
    .split("|")
    .filter(Boolean)
    .map((part) => {
      const [id, value] = part.split(";").filter(Boolean);

      return [integer(id), float(value)];
    });
}

export function vipEffects(
  vip: Row | undefined,
  rules: Rules,
  now: number,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  if (!vip) return effects;

  if (!Number.isSafeInteger(now)) return invalid();

  const end = long(vip.vipEndTime);

  if (end <= BigInt(now)) return effects;

  if (!rules.power.vip?.size) return invalid();

  const score = integer(vip.score);
  let selected: Rule | undefined;

  for (const rule of rules.power.vip.values()) {
    if (integer(rule.point) <= score) selected = rule;
  }

  if (selected) for (const [id, value] of pairs(selected.effect)) effects.set(id, value);

  const level = integer(vip.sLevel);

  if (level > 0) {
    const id = String(Number(BigInt.asIntN(32, 7009n + BigInt(level))));
    const rule = rules.power.superVip?.get(id);

    if (!rule) return invalid();

    for (const [effect, value] of pairs(rule.effect))
      effects.set(effect, float((effects.get(effect) ?? 0) + value));
  }

  return effects;
}

export function allianceScienceEffects(
  sciences: readonly Row[],
  rules: Rules,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  for (const row of sciences) {
    const id = String(
      Number(BigInt.asIntN(32, BigInt(integer(row.scienceId)) + BigInt(integer(row.level)))),
    );
    const rule = rules.power.allianceSciences?.get(id);

    if (!rule || rule.para1 === undefined) return invalid();

    const value = float(rule.para2);

    for (const raw of rule.para1.split(";").filter(Boolean)) {
      const effect = integer(raw);
      effects.set(effect, float(value + (effects.get(effect) ?? 0)));
    }
  }

  return effects;
}
