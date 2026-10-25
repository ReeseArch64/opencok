import type { Rules } from "./game";
import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import {
  generalBase,
  generalPairs,
  generalContent,
  generalLevel,
  generalFailure,
} from "./general-progression";

export function validateGeneralTalents(
  rules: Rules,
  row: Row,
  points: ReadonlyMap<number, number>,
) {
  const base = generalBase(rules, num(row, "id"));
  let used = 0;
  for (const [id, value] of points) {
    const skill = rules.power.newGeneralSkills?.get(String(id));
    if (
      !skill ||
      skill.skill_group !== base.talent ||
      value < 1 ||
      value > cityInteger(skill.max_lv, 1)
    )
      generalFailure();
    if (skill.learn_lv && num(row, "level") < cityInteger(skill.learn_lv, 1)) generalFailure();
    const conditions = generalPairs(skill.condition_skill);
    if (conditions.size && ![...conditions].some(([id, value]) => (points.get(id) ?? 0) >= value))
      generalFailure();
    used = cityInteger(used + value);
  }
  const remaining = generalLevel(rules, base, num(row, "level")).points - used;
  if (remaining < 0) generalFailure();
  return remaining;
}
export function activateGeneralTalent(rules: Rules, row: Row, id: number, full: number) {
  cityInteger(full, 0, 1);
  const points = generalPairs(text(row, "talent")),
    rule = rules.power.newGeneralSkills?.get(String(id));
  if (!rule) generalFailure();
  const remaining = validateGeneralTalents(rules, row, points),
    previous = points.get(id) ?? 0;
  const addition = full ? Math.min(remaining, cityInteger(rule.max_lv, 1) - previous) : 1;
  if (addition <= 0 || addition > remaining) generalFailure();
  points.set(id, previous + addition);
  return {
    ...row,
    talent: generalContent(points),
    talentpoint: validateGeneralTalents(rules, row, points),
  };
}
