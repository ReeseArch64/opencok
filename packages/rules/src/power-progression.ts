import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import { ruleAvailable, type RuleContext } from "./availability.ts";
import type { Rule, Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";
import {
  effectInteger as integer,
  effectFloat as float,
  effectLong as long,
  invalidEffect as invalid,
} from "./power-values.ts";

function prestigeRange(value: bigint, source: string | undefined): boolean {
  const points = source?.split(";").filter(Boolean).map(long) ?? [];

  if (points.length === 1) {return points[0]! <= 0n ? value < points[0]! : value >= points[0]!;}

  return points.length === 2 && value >= points[0]! && value < points[1]!;
}

export function prestigeEffects(
  profile: Row,
  prestiges: readonly Row[],
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  if (!ruleAvailable(rules.features.get("civilization"), context)) {return effects;}

  const civilization = integer(profile.civilizationType ?? 0);

  if (civilization === 0) {return effects;}

  const prestige = prestiges.find((row) => integer(row.civilizationType) === civilization);

  if (!prestige) {return effects;}

  const levels = rules.power.prestigeLevelRecords ?? [
    ...(rules.power.prestigeLevels?.values() ?? []),
  ];

  if (!levels.length) {return invalid();}

  const value = long(prestige.prestigeValue ?? 0);
  const level = levels.find((rule) => prestigeRange(value, rule.reputation_point));

  if (!level) {return effects;}

  if (!rules.power.civilizationFeatures?.size) {return invalid();}

  const feature = [...rules.power.civilizationFeatures.values()].find(
    (rule) =>
      rule.type !== undefined &&
      rule.reputation_level !== undefined &&
      integer(rule.type) === civilization &&
      integer(rule.reputation_level) === integer(level.reputation_level),
  );

  if (!feature?.effect?.trim()) {return effects;}

  for (const segment of feature.effect.split("|").filter(Boolean)) {
    const parts = segment.split(";").filter(Boolean);

    if (parts.length === 2) {effects.set(integer(parts[0]), float(parts[1]));}
  }

  return effects;
}

export function militaryEffects(
  military: Row | undefined,
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  if (!military || !serverFeature(rules, "wr_switch", context)) {return effects;}

  const skills = text(military, "skill");

  if (!skills.trim()) {return effects;}

  const groups = new Map<string, { rule: Rule; level: number }>();

  for (const id of skills.split("|").filter(Boolean)) {
    const rule = rules.power.militarySkills?.get(id);

    if (!rule) {return invalid();}

    if (!rule.group?.trim() || !rule.level?.trim()) {continue;}

    const level = integer(rule.level);

    if (level > (groups.get(rule.group)?.level ?? 0)) {groups.set(rule.group, { rule, level });}
  }

  for (const { rule } of groups.values()) {
    if (!rule.status?.trim()) {continue;}

    const status = rules.power.statuses?.get(rule.status);

    if (!status) {return invalid();}

    if (!status.effect?.trim()) {continue;}

    for (const segment of status.effect.split("|")) {
      const [id, value] = segment.split(";");
      const effect = integer(id);
      effects.set(
        effect,
        Number(BigInt.asIntN(32, BigInt(effects.get(effect) ?? 0) + BigInt(integer(value)))),
      );
    }
  }

  return effects;
}

export function miracleEffects(
  miracle: Row | undefined,
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  if (!miracle || !ruleAvailable(rules.features.get("miracle_buff"), context)) {return effects;}

  const level = integer(miracle.level ?? 0);

  if (level === 0) {return effects;}

  let selected: Rule | undefined;

  for (const rule of rules.power.miracleBuffs?.values() ?? []) {
    if (rule.order !== undefined && integer(rule.order) === level) {selected = rule;}
  }

  if (!selected) {return invalid();}

  if (selected.para === undefined) {return effects;}

  for (const segment of selected.para.split("|")) {
    const [ids, raw] = segment.split(",");

    if (ids === undefined) {return invalid();}

    const value = float(raw);

    for (const id of ids.split(";")) {effects.set(integer(id), value);}
  }

  return effects;
}
