import type { GeneralSkill } from "@opencok/contracts/power";
import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import type { Rule, Rules } from "./game.ts";
import { ruleAvailable, type RuleContext } from "./availability.ts";
import { serverFeature } from "./power-context.ts";

import {
  effectInteger as integer,
  effectFloat as float,
  invalidEffect as invalid,
} from "./power-values.ts";

function split(raw: string | undefined, delimiter = "|"): string[] {
  return raw?.split(delimiter).filter(Boolean) ?? [];
}

function add(effects: Map<number, number>, id: number, value: number) {
  effects.set(id, float((effects.get(id) ?? 0) + value));
}

function addEquipment(effects: Map<number, number>, id: number, value: number) {
  effects.set(id, Math.max(0, float((effects.get(id) ?? 0) + value)));
}

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

      const ids = split(rule.para1);
      const bases = split(rule.base);
      const increments = split(rule.add);

      if (!ids.length || bases.length < ids.length || increments.length < ids.length)
        return invalid();

      const points = Number(BigInt.asIntN(32, BigInt(integer(skill.points)) - 1n));
      const skillEffects = new Map<number, number>();

      for (const [index, id] of ids.entries()) {
        const increase = float(float(points) * float(increments[index]));
        skillEffects.set(integer(id), float(float(bases[index]) + increase));
      }

      for (const [id, value] of skillEffects) add(general, id, value);
    }

    for (const [id, value] of general) add(effects, id, value);
  }

  return effects;
}

function equipmentMultiplier(rule: Rule, effectValue: (id: number) => number): number {
  if (!rule.color || !rule.site) return 1;

  const color = integer(rule.color);
  const site = integer(rule.site);

  if (color < 0 || color > 5 || site < 0 || site > 6) return invalid();

  const colorEffect = color >= 2 ? float(effectValue(212 + color)) : 0;
  const siteEffect = float(effectValue([207, 209, 208, 210, 211, 212, 213][site]!));

  return float(1 + float(float(colorEffect + siteEffect) / 100));
}

export function equipmentEffects(
  equipment: readonly Row[],
  rules: Rules,
  effectValue: (id: number, equipped: ReadonlyMap<number, number>) => number,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();

  for (const row of equipment) {
    if (integer(row.on) !== 1) continue;

    const rule = rules.power.equipment?.get(text(row, "itemId"));

    if (!rule) return invalid();

    const multiplier = equipmentMultiplier(rule, (id) => effectValue(id, effects));
    const equipped = new Map<number, number>();

    if (rule.site === "6") {
      const ids = split(rule.para1);
      const values = split(rule.num1);

      if (!ids.length || values.length < ids.length) return invalid();

      for (const [index, id] of ids.entries())
        add(equipped, integer(id), float(float(values[index]) * multiplier));

      if (rule.para2 !== undefined && !text(row, "extraProperty")) return invalid();
    } else {
      for (let index = 1; index < 100; index++) {
        const ids = rule[`para${index}`];

        if (!ids?.trim()) break;

        const value = float(float(rule[`num${index}`]) * multiplier);

        for (const id of split(ids)) add(equipped, integer(id), value);
      }
    }

    const extra = new Map<number, number>();

    for (const segment of split(text(row, "extraProperty"))) {
      const [ids, raw] = segment.split(",");

      if (!ids) return invalid();

      const value = float(float(raw) * multiplier);

      for (const id of split(ids, "@")) add(extra, integer(id), value);
    }

    for (const [id, value] of extra) add(equipped, id, value);

    for (const [id, value] of equipped) addEquipment(effects, id, value);
  }

  return effects;
}

function addSet(effects: Map<number, number>, ids: string | undefined, values: string | undefined) {
  if (ids === undefined || values === undefined) return;

  for (const id of split(ids)) addEquipment(effects, integer(id), float(split(values)[0]));
}

export function equipmentSetEffects(
  equipment: readonly Row[],
  selection: string | null | undefined,
  rules: Rules,
  context: RuleContext,
  base: ReadonlyMap<number, number>,
): ReadonlyMap<number, number> {
  const effects = new Map(base);

  if (ruleAvailable(rules.features.get("suit"), context)) {
    const counts = new Map<string, { count: number; level: number }>();

    for (const row of equipment) {
      if (integer(row.on) !== 1) continue;

      const rule = rules.power.equipment?.get(text(row, "itemId"));

      if (!rule) return invalid();

      if (!rule.suit_id) continue;

      const set = rules.power.equipmentSets?.get(rule.suit_id);

      if (!set) return invalid();

      const prior = counts.get(rule.suit_id) ?? { count: 0, level: 10 };
      counts.set(rule.suit_id, {
        count: prior.count + 1,
        level: Math.min(prior.level, integer(row.strengthLevel)),
      });
    }

    for (const [id, { count, level }] of counts) {
      const set = rules.power.equipmentSets!.get(id)!;

      for (let index = 1; index <= 3; index++) {
        if (count >= index * 2 && set[`suit_hero${index}`] === undefined)
          addSet(effects, set[`suit_para${index}`], set[`suit_num${index}`]);
      }

      if (level > 0 && count === 6 && serverFeature(rules, "equipment_strengthen", context)) {
        const ids = split(set.suit_effect, "#");
        const values = split(set.suit_value, "#");

        for (let step = Math.floor(level / 2); step >= 1; step--) {
          const id = split(ids[step - 1], "-")[1];
          const value = split(values[step - 1], "-")[1];

          try {
            addSet(effects, id, value);
          } catch (error) {
            if (!(error instanceof GameError)) throw error;
          }
        }
      }
    }
  }

  const selected = split(selection ?? "0;0;0", ";");

  if (selected.length < 3) return invalid();

  for (let index = 0; index < 3; index++) {
    const id = selected[index]!;

    if (id === "0") continue;

    const set = rules.power.equipmentSets?.get(id);

    if (!set) return invalid();

    addSet(effects, set[`suit_para${index + 1}`], set[`suit_num${index + 1}`]);
  }

  return effects;
}
