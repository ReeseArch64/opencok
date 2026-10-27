import type { Rules } from "@opencok/rules/game";
import { num, text, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "@opencok/rules/city-progression";
import { mailBlank } from "@opencok/rules/mail";
import {
  generalBase,
  generalPairs,
  generalContent,
  generalFailure,
} from "./general-progression.ts";

export function validateGeneralTalents(
  rules: Rules,
  row: Row,
  points: ReadonlyMap<number, number>,
) {
  const base = generalBase(rules, num(row, "id"));

  for (const [id, value] of points) {
    const skill = rules.power.newGeneralSkills?.get(String(id));

    if (
      !skill ||
      skill.skill_group !== base.talent ||
      value < 1 ||
      value > cityInteger(skill.max_lv, 1)
    )
      {generalFailure();}

    const conditions = generalPairs(mailBlank(skill.condition_skill) ? "" : skill.condition_skill);

    if (conditions.size && ![...conditions].some(([id, value]) => (points.get(id) ?? 0) >= value))
      {generalFailure();}
  }

  return cityInteger(num(row, "talentpoint"));
}

export function activateGeneralTalent(rules: Rules, row: Row, id: number, full: number) {
  cityInteger(full, 0, 1);
  const points = generalPairs(text(row, "talent")),
    rule = rules.power.newGeneralSkills?.get(String(id));

  if (!rule) {generalFailure();}

  const remaining = validateGeneralTalents(rules, row, points),
    previous = points.get(id) ?? 0;

  if (rule.learn_lv && num(row, "level") < cityInteger(rule.learn_lv, 1)) {generalFailure();}

  const addition = full ? Math.min(remaining, cityInteger(rule.max_lv, 1) - previous) : 1;

  if (addition <= 0 || addition > remaining) {generalFailure();}

  points.set(id, previous + addition);
  const next = { ...row, talent: generalContent(points), talentpoint: remaining - addition };
  validateGeneralTalents(rules, next, points);

  return next;
}
