import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { civilizationScience } from "@opencok/rules/civilization-science";

export function civilizationScienceView(
  rules: Rules,
  base: number,
  level: number,
  deadline = 0n,
): Fields {
  const rule = civilizationScience(rules, base, level);
  const next = rules.power.civilizationSciences?.get(String(base + level + 1));
  const effect = (value: string | undefined) =>
    value === undefined ? -1 : Math.fround(Math.fround(Number(value)) / 100);
  const result: Fields = {
    level: sfs.int(level),
    itemId: sfs.string(String(base)),
    cd: sfs.long(deadline),
    para2: { type: Type.Float, value: effect(rule.para2) },
    nextPara2: { type: Type.Float, value: next ? effect(next.para2) : 0 },
  };

  for (const key of [
    "max_lv",
    "research_need",
    "time_research",
    "building_condition",
    "science_condition",
    "reputation_condition",
    "para1",
    "science_point",
    "vip",
  ])
    if (rule[key] !== undefined) result[key] = sfs.string(rule[key]);

  return result;
}
