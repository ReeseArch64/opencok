import type { GeneralSkill } from "@opencok/hero/contracts/generals";

import type { Rules } from "@opencok/rules/game";

import {
  effectInteger as integer,
  effectFloat as float,
  invalidEffect as invalid,
} from "@opencok/rules/power-values";

export function generalSkillEffects(
  generals: readonly (readonly GeneralSkill[])[],
  rules: Rules,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  for (const skills of generals) {
    const general = new Map<number, number>();

    for (const skill of skills) {
      const rule = rules.power.generalSkills?.get(skill.id);

      if (!rule) return invalid();

      if (rule.type !== "0") continue;

      const ids = rule.para1?.split("|").filter(Boolean) ?? [];
      const bases = rule.base?.split("|").filter(Boolean) ?? [];
      const increments = rule.add?.split("|").filter(Boolean) ?? [];

      if (!ids.length || bases.length < ids.length || increments.length < ids.length)
        return invalid();

      const points = Number(BigInt.asIntN(32, BigInt(integer(skill.points)) - 1n));
      const skillEffects = new Map<number, number>();

      for (const [index, id] of ids.entries()) {
        const increase = float(float(points) * float(increments[index]));
        skillEffects.set(integer(id), float(float(bases[index]) + increase));
      }

      for (const [id, value] of skillEffects)
        general.set(id, float((general.get(id) ?? 0) + value));
    }

    for (const [id, value] of general) effects.set(id, float((effects.get(id) ?? 0) + value));
  }

  return effects;
}
