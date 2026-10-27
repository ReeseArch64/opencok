import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import type { RuleContext } from "./availability.ts";
import { javaCalendarDate } from "./java-calendar-date.ts";
import type { Rule, Rules } from "./game.ts";
import { powerFeatureContext } from "./power-context.ts";
import {
  effectInteger as integer,
  effectFloat as float,
  effectDouble as double,
  invalidEffect as invalid,
} from "./power-values.ts";

export function selectHeroes(heroes: readonly Row[]): readonly Row[] {
  const selected = new Map<number, { row: Row; index: number }>();

  for (const [index, row] of heroes.entries()) {
    const family = Math.trunc(integer(row.heroid) / 100);
    const previous = selected.get(family);
    const level = integer(row.level ?? 0);
    const exp = integer(row.exp ?? 0);

    if (
      !previous ||
      level > integer(previous.row.level ?? 0) ||
      (level === integer(previous.row.level ?? 0) && exp >= integer(previous.row.exp ?? 0))
    )
      selected.set(family, { row, index });
  }

  const indices = new Set([...selected.values()].map((entry) => entry.index));

  return heroes.filter((_row, index) => indices.has(index));
}

export function heroEffects(
  heroes: readonly Row[],
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();
  const event = rules.power.activityEvents?.get("9005005");

  if (!Number.isSafeInteger(context.now)) return effects;

  let start = 0n;
  let end = 0n;

  if (event && Object.keys(event).length) {
    const parsedStart = javaCalendarDate(event.k1!, 5, context.utcOffsetMinutes);

    if (parsedStart !== undefined) {
      const parsedEnd = javaCalendarDate(event.k2!, 5, context.utcOffsetMinutes, parsedStart);

      if (parsedEnd !== undefined) {
        start = parsedStart;
        end = parsedEnd;
      }
    }
  }

  const now = BigInt(context.now);

  if (now < start || now > end) return effects;

  for (const hero of selectHeroes(heroes)) {
    const rule = rules.power.heroes?.get(text(hero, "heroid"));

    if (!rule) return invalid();

    const contribution = new Map<number, number>();

    for (let index = 1; rule[`para${index}`] !== undefined; index++) {
      for (const segment of rule[`para${index}`]!.split("|").filter(Boolean)) {
        const [id, raw] = segment.split(";").filter(Boolean);
        const effect = integer(id);
        contribution.set(effect, float((contribution.get(effect) ?? 0) + float(raw)));
      }
    }

    for (const [id, value] of contribution) effects.set(id, float((effects.get(id) ?? 0) + value));
  }

  return effects;
}

function skillEffects(skill: Row, rule: Rule, effects: Map<number, number>) {
  const base = rule.base?.split("|");
  const increments = rule.base_add?.split("|");

  if (!base?.length || !increments || increments.length < base.length) return invalid();

  const steps = Number(
    BigInt.asIntN(32, BigInt(integer(skill.level)) - BigInt(integer(rule.init_Lv))),
  );

  for (const [index, segment] of base.entries()) {
    const [rawId, rawValue] = segment.split(";");
    const id = integer(rawId);
    const value = double(double(rawValue) + double(increments[index]) * steps);
    effects.set(id, double((effects.get(id) ?? 0) + value));
  }

  const strengthen = integer(skill.strengthenLevel ?? 0);

  if (strengthen <= 0 || !rule.boost_effect?.trim()) return;

  for (const segment of rule.boost_effect.split("|").filter(Boolean)) {
    const parts = segment.split(";").filter(Boolean);

    if (parts.length < 3 || strengthen < integer(parts[0])) continue;

    const id = integer(parts[1]);
    effects.set(id, double((effects.get(id) ?? 0) + double(parts[2])));
  }
}

export function dragonSkillEffects(
  dragons: readonly Row[],
  skills: readonly Row[],
  rules: Rules,
  context: RuleContext,
  talents: readonly Row[] = [],
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  if (!powerFeatureContext(rules, context).dragonLevelUp) return effects;

  for (const dragon of dragons) {
    if (integer(dragon.dragonState) !== 3 || integer(dragon.useFlag ?? 0) !== 1) continue;

    const slots = new Map<number, Row>();

    for (const skill of skills) {
      if (integer(skill.ownerId) === integer(dragon.itemId))
        slots.set(integer(skill.index1), skill);
    }

    const contribution = new Map<number, number>();

    for (const skill of slots.values()) {
      const rule = rules.power.dragonSkills?.get(text(skill, "skillId"));

      if (!rule) return invalid();

      if (integer(rule.type) !== 1 || integer(rule.unlock_lv) > integer(dragon.lv)) continue;

      skillEffects(skill, rule, contribution);
    }

    for (const [id, value] of contribution) effects.set(id, double((effects.get(id) ?? 0) + value));
  }

  for (const talent of talents) {
    if (
      Number(talent.startTime ?? 0) > context.now ||
      Number(talent.actTime ?? 0) < context.now ||
      Number(talent.actTime ?? 0) === 0 ||
      integer(talent.stat) !== 2
    )
      continue;

    if (
      !dragons.some(
        (dragon) =>
          integer(dragon.itemId) === integer(talent.dragonId) && integer(dragon.dragonState) === 3,
      )
    )
      continue;

    const rule = rules.power.dragonSkills?.get(text(talent, "skillId"));

    if (!rule || rule.type !== "12") continue;

    const pairs = (rule.base ?? "").split("|").filter(Boolean),
      increments = (rule.base_add ?? "").split("|");

    for (const [index, pair] of pairs.entries()) {
      const [id, raw] = pair.split(";");
      const value = Number(raw) + (integer(talent.level) - 1) * Number(increments[index] ?? 0);

      if (!Number.isFinite(value)) return invalid();

      effects.set(integer(id), double((effects.get(integer(id)) ?? 0) + value));
    }
  }

  return effects;
}
