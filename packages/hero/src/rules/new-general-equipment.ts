import type { RuleContext } from "@opencok/rules/availability";
import type { Rule, Rules } from "@opencok/rules/game";
import type { NewGeneralBuildingState } from "./new-general-building.ts";
import { newGeneralBuildingEffect, type NewGeneralEffectState } from "./new-general-effects.ts";
import { generalContent, generalInteger, generalSavedInteger } from "./new-general-content.ts";
import { javaFloat } from "@opencok/rules/java-float";
import { javaHashMapOrder, javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import { mailBlank } from "@opencok/rules/mail";

export type NewGeneralEquipmentModifier =
  | 207
  | 208
  | 209
  | 210
  | 211
  | 212
  | 213
  | 214
  | 215
  | 216
  | 217
  | 218;

export interface NewGeneralEquipment {
  itemId: number;
  extraProperty: string | null;
}

export interface NewGeneralEquippedState extends NewGeneralEffectState {
  orderedEquipment: readonly NewGeneralEquipment[];
}

function simple(raw: string | null | undefined, separator: string, limit = 65535): string[] {
  if (raw == null) {return [];}

  if (typeof raw !== "string" || raw.length > limit)
    {throw new Error("Invalid general equipment content");}

  const values = raw.split(separator).filter(Boolean);

  if (values.length > 4096) {throw new Error("Too many general equipment values");}

  return values;
}

function javaSplit(raw: string, separator: string): string[] {
  const values = raw.split(separator);

  while (values.at(-1) === "") {values.pop();}

  return values;
}

function ownerValue(
  resolve: (id: NewGeneralEquipmentModifier) => number,
  id: NewGeneralEquipmentModifier,
): number {
  const value = resolve(id);

  if (typeof value !== "number") {throw new Error("Invalid general equipment modifier");}

  return Math.fround(value);
}

function multiplier(rule: Rule, resolve: (id: NewGeneralEquipmentModifier) => number): number {
  if (!rule.color || !rule.site) {return 1;}

  const color = generalInteger(rule.color);

  if (color < 0 || color > 5) {throw new Error("Invalid equipment color");}

  let value = 0;

  if (color >= 2)
    {value = Math.fround(value + ownerValue(resolve, ([214, 215, 216, 217] as const)[color - 2]!));}

  const site = generalInteger(rule.site);

  if (site < 0 || site > 6) {throw new Error("Invalid equipment site");}

  value = Math.fround(
    value + ownerValue(resolve, ([207, 209, 208, 210, 211, 212, 213] as const)[site]!),
  );

  return Math.fround(1 + Math.fround(value / 100));
}

function append(target: Map<number, number>, id: number, value: number) {
  target.set(id, target.has(id) ? Math.fround(target.get(id)! + value) : value);
}

function itemEffects(
  rule: Rule,
  extraProperty: string | null,
  resolve: (id: NewGeneralEquipmentModifier) => number,
): Map<number, number> {
  const values = new Map<number, number>();
  const factor = multiplier(rule, resolve);

  if (rule.site === "6") {
    if (rule.para1 === undefined) {throw new Error("Missing dragon equipment effects");}

    const ids = simple(rule.para1, "|");
    const amounts = simple(rule.num1, "|");

    for (const [i, id] of ids.entries())
      {append(values, generalInteger(id), Math.fround(javaFloat(amounts[i]) * factor));}
  } else {
    for (let index = 1; index < 100; index++) {
      const raw = rule[`para${index}`];

      if (mailBlank(raw)) {break;}

      const ids = simple(raw, "|");
      const value = Math.fround(javaFloat(rule[`num${index}`]) * factor);

      for (const id of ids) {append(values, generalInteger(id), value);}
    }
  }

  const entries = simple(extraProperty, "|", 255);
  const extraFactor = multiplier(rule, resolve);
  const extra = new Map<number, number>();

  for (const entry of entries) {
    const parts = javaSplit(entry, ",");

    if (parts[0] === undefined) {throw new Error("Missing equipment extra effect");}

    const ids = parts[0].includes("@") ? javaSplit(parts[0], "@") : [parts[0]];
    const effects = ids.map(generalInteger);
    const value = Math.fround(javaFloat(parts[1]) * extraFactor);

    for (const id of effects) {append(extra, id, value);}
  }

  for (const id of javaIntHashMapOrder(extra.keys()))
    {values.set(id, values.has(id) ? Math.fround(extra.get(id)! + values.get(id)!) : extra.get(id)!);}

  return values;
}

export function newGeneralEquipmentEffects(
  generalId: number,
  orderedEquipment: readonly NewGeneralEquipment[],
  rules: Rules,
  resolve: (id: NewGeneralEquipmentModifier) => number,
): ReadonlyMap<number, number> {
  generalSavedInteger(generalId);

  if (orderedEquipment.length > 4096) {throw new Error("Too many general equipment pieces");}

  const result = new Map<number, number>();
  const suits = new Map<string, number>();

  for (const item of orderedEquipment) {
    const rule = rules.power.equipment?.get(String(generalSavedInteger(item.itemId))) ?? {};
    const values = itemEffects(rule, item.extraProperty, resolve);

    for (const id of javaIntHashMapOrder(values.keys())) {
      const factor = Math.fround(1 + Math.fround(ownerValue(resolve, 218) / 100));
      result.set(id, Math.fround((result.get(id) ?? 0) + Math.fround(values.get(id)! * factor)));
    }

    if (rule.suit_id !== undefined) {suits.set(rule.suit_id, (suits.get(rule.suit_id) ?? 0) + 1);}
  }

  for (const id of javaHashMapOrder(suits.keys())) {
    const rule = rules.power.equipmentSets?.get(id) ?? {};

    for (let tier = 1; tier <= 3; tier++) {
      if (suits.get(id)! < tier * 2) {continue;}

      const heroes = rule[`suit_hero${tier}`];

      if (heroes !== undefined && !generalContent(heroes, ",").includes(String(generalId)))
        {continue;}

      const value = javaFloat(rule[`suit_num${tier}`]);
      const raw = rule[`suit_para${tier}`];

      if (raw === undefined) {throw new Error("Missing general equipment suit effects");}

      if (!raw) {continue;}

      if (raw.length > 65535) {throw new Error("Oversized general equipment suit effects");}

      const effects = raw
        .split("|")
        .filter((part, i, all) => part.length > 0 || i === all.length - 1);

      if (effects.length > 4096) {throw new Error("Too many general equipment suit effects");}

      for (const effect of effects) {
        const key = generalInteger(effect);
        result.set(key, Math.fround((result.get(key) ?? 0) + value));
      }
    }
  }

  return new Map(javaIntHashMapOrder(result.keys()).map((id) => [id, result.get(id)!]));
}

export function equippedGeneralBuildingEffect(
  read: () => {
    orderedGenerals: readonly NewGeneralEquippedState[];
    building: NewGeneralBuildingState;
  },
  rules: Rules,
  context: RuleContext,
  effect: number,
  resolve: (id: NewGeneralEquipmentModifier) => number,
  clock: () => bigint,
): number {
  return newGeneralBuildingEffect(
    read,
    rules,
    context,
    effect,
    (general, id) =>
      newGeneralEquipmentEffects(general.id, general.orderedEquipment, rules, resolve).get(id) ?? 0,
    clock,
  );
}
