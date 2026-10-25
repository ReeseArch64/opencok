import type { Rule, Rules } from "./game";
import type { Row } from "@opencok/contracts/rows";
import { num, text } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import { generalBase, generalPairs, generalList, generalFailure } from "./general-progression";
export interface GeneralProperty {
  id: number;
  value: number;
  count: number;
}
export type GeneralProperties = Map<number, GeneralProperty>;
export type GeneralRandom = (limit: number) => number;
const round = (value: number) => Math.fround(Math.round(Math.fround(value) * 100) / 100);
function range(min: number, max: number, random: GeneralRandom) {
  if (
    !Number.isSafeInteger(min) ||
    !Number.isSafeInteger(max) ||
    max < min ||
    max - min > 2147483646
  )
    generalFailure();
  const value = random(max - min + 1);
  if (!Number.isInteger(value) || value < 0 || value > max - min) generalFailure();
  return min + value;
}
export function generalProperties(raw: string): GeneralProperties {
  const values = new Map<number, GeneralProperty>();
  if (!raw) return values;
  for (const entry of raw.split("|")) {
    const [slot, data, extra] = entry.split(";"),
      parts = data?.split("_");
    if (extra !== undefined || parts?.length !== 3) generalFailure();
    const index = cityInteger(slot, 1, 5),
      value = Number(parts[1]);
    if (values.has(index) || !Number.isFinite(value) || value < 0) generalFailure();
    values.set(index, { id: cityInteger(parts[0], 1), value, count: cityInteger(parts[2]) });
  }
  return values;
}
export function generalPropertiesContent(values: GeneralProperties) {
  return [...values]
    .map(([index, value]) => `${index};${value.id}_${value.value}_${value.count}`)
    .join("|");
}
export function generalPropertyRule(rules: Rules, id: number) {
  const rule = rules.power.newGeneralRefinement?.get(String(id));
  if (!rule || !Number.isFinite(Number(rule.max)) || Number(rule.max) <= 0) generalFailure();
  return rule;
}
function choose(rules: Rules, row: Row, exclude: ReadonlySet<number>, random: GeneralRandom) {
  const choices = [...(rules.power.newGeneralRefinement?.values() ?? [])].filter(
    (rule) =>
      Number(rule.general_id) === num(row, "id") &&
      !exclude.has(Number(rule.id)) &&
      Number(rule.rate) > 0,
  );
  const total = choices.reduce((sum, rule) => sum + cityInteger(rule.rate), 0);
  let value = range(0, cityInteger(total, 1) - 1, random);
  for (const rule of choices) {
    value -= Number(rule.rate);
    if (value < 0) return cityInteger(rule.id, 1);
  }
  return generalFailure();
}
export function activateGeneralRefinement(rules: Rules, row: Row, random: GeneralRandom) {
  const base = generalBase(rules, num(row, "id")),
    values = generalProperties(text(row, "refineproperty")),
    next = values.size + 1;
  const requiredLevel = generalPairs(base.unlock_level).get(next),
    requiredStar = generalPairs(base.unlock_star).get(next),
    cost = generalPairs(base.unlock_goods_num).get(next);
  if (
    requiredLevel === undefined ||
    num(row, "level") < requiredLevel ||
    (requiredStar !== undefined && num(row, "star") < requiredStar) ||
    (generalPairs(base.refine_num).get(next) ?? 0) <= 0 ||
    cost === undefined
  )
    generalFailure();
  const id = choose(rules, row, new Set([...values.values()].map((value) => value.id)), random),
    max = Number(generalPropertyRule(rules, id).max);
  const value = round(
    (range(1, cityInteger(rules.items.get("general_random_effect")?.k1, 1, 10000), random) * max) /
      10000,
  );
  values.set(next, { id, value, count: 0 });
  const raw = generalPropertiesContent(values);
  return {
    row: { ...row, refineproperty: raw, refreshproperty: raw, oldrefineproperty: "" },
    item: base.goods_id,
    cost,
  };
}
function limit(rules: readonly Rule[] | undefined, id: number, consumed: number, field: string) {
  for (const rule of rules ?? []) {
    const [min, max] = rule.consume?.split(";").map(Number) ?? [];
    if (Number(rule.general_id) === id && consumed >= min! && consumed <= max!)
      return cityInteger(rule[field]);
  }
  return 0;
}
function valueRange(rules: Rules, id: number, index: number, value: number) {
  const rule = rules.general.refinementValues?.find(
    (rule) =>
      Number(rule.general_id) === id &&
      Number(rule.effect_num) === index &&
      value >= Number(rule.now_min) &&
      value <= Number(rule.now_max),
  );
  if (!rule) generalFailure();
  return rule;
}
function refineValue(
  rules: Rules,
  row: Row,
  values: GeneralProperties,
  index: number,
  property: GeneralProperty,
  random: GeneralRandom,
) {
  const maximum = Number(generalPropertyRule(rules, property.id).max),
    rate = Math.trunc(Math.fround(property.value / maximum) * 10000),
    config = valueRange(rules, num(row, "id"), index, rate);
  const maxCount = [...values.values()].filter(
    (value) => value.value >= Number(generalPropertyRule(rules, value.id).max),
  ).length;
  if (
    Number(config.now_max) === 9999 &&
    maxCount <
      limit(rules.general.refinementLimits, num(row, "id"), num(row, "refinecard"), "max_num") &&
    range(1, 10000, random) <= cityInteger(rules.items.get("general_random_effect")?.k2, 0, 10000)
  )
    return maximum;
  let min = Number(config.random_min),
    max = Number(config.random_max);
  const most = cityInteger(config.most_count);
  if (most > 0 && property.count > most)
    min = Math.min(
      0,
      min + (property.count - most) * cityInteger(rules.items.get("general_random_effect")?.k3),
    );
  const addition = Math.fround((range(min, max, random) * maximum) / 10000);
  let value = Math.fround(property.value + addition);
  const next = valueRange(
    rules,
    num(row, "id"),
    index,
    value >= maximum ? 9999 : Math.trunc(Math.fround(value / maximum) * 10000),
  );
  if (
    Number(next.now_min) > Number(config.now_min) &&
    Number(config.limit_count) > 0 &&
    property.count < Number(config.limit_count)
  ) {
    const delta = Math.fround(value - (Number(next.now_min) / 10000) * maximum);
    value = Math.fround(
      value + range(-Math.trunc(delta * 2 * 10000), -Math.trunc(delta * 10000) + 1, random) / 10000,
    );
  }
  value = Math.max(0, value);
  if (value >= maximum) value = Math.fround(value - 2 * addition);
  return round(Math.max(0, Math.min(maximum, value)));
}
export function refineGeneralValues(rules: Rules, row: Row, batch: boolean, random: GeneralRandom) {
  const current = generalProperties(text(row, "refineproperty")),
    values = generalProperties(text(row, "refreshproperty") || text(row, "refineproperty"));
  if (!values.size || values.size !== current.size) generalFailure();
  const needed = [...values].filter(
    ([, value]) => value.value < Number(generalPropertyRule(rules, value.id).max),
  );
  if (!needed.length) generalFailure();
  let raw = "";
  for (let iteration = 0; iteration < (batch ? 10 : 1); iteration++) {
    let allDown = true,
      down = 0;
    const downIndices: number[] = [];
    for (const [index, property] of values) {
      const maximum = Number(generalPropertyRule(rules, property.id).max);
      if (property.value >= maximum) continue;
      let value = refineValue(rules, row, values, index, property, random);
      const previous = batch ? property.value : current.get(index)!.value;
      if (value === previous)
        value = round(Math.max(0, Math.min(maximum, value + (range(0, 1, random) ? 0.01 : -0.01))));
      if (value > previous) allDown = false;
      else {
        down += Math.trunc(((previous - value) / maximum) * 10000);
        downIndices.push(index);
      }
      values.set(index, { ...property, value, count: cityInteger(property.count + 1) });
    }
    raw = generalPropertiesContent(values);
    if (!batch && allDown && downIndices.length > 1) {
      const index = downIndices[range(0, downIndices.length - 1, random)]!,
        value = values.get(index)!,
        previous = current.get(index)!,
        maximum = Number(generalPropertyRule(rules, value.id).max);
      down -= Math.trunc(((previous.value - value.value) / maximum) * 10000);
      const rate = Math.min(
        cityInteger(rules.items.get("general_random_effect")?.k5),
        Math.trunc(
          down /
            (downIndices.length - 1) /
            cityInteger(rules.items.get("general_random_effect")?.k6, 1),
        ),
      );
      value.value = round(
        Math.min(
          maximum,
          Math.max(previous.value + 0.01, previous.value + (rate * maximum) / 10000),
        ),
      );
    }
  }
  return {
    row: { ...row, refreshproperty: raw, oldrefineproperty: generalPropertiesContent(values) },
    count: needed.length,
  };
}
export function refineGeneralTypes(rules: Rules, row: Row, random: GeneralRandom) {
  const base = generalBase(rules, num(row, "id")),
    values = generalProperties(text(row, "refineproperty")),
    locked = new Set(generalList(text(row, "lockproperty")));
  const slots = [...values.keys()].filter((index) => !locked.has(index));
  if (!slots.length) generalFailure();
  const cost = generalPairs(base.refine_effect).get(slots.length),
    lockCost = locked.size ? generalPairs(base.refine_effect_lock).get(locked.size) : 0;
  if (cost === undefined || lockCost === undefined) generalFailure();
  const maps = [
    values,
    generalProperties(text(row, "refreshproperty")),
    generalProperties(text(row, "oldrefineproperty")),
  ];
  const repeats = limit(
    rules.general.refinementRepeats,
    num(row, "id"),
    num(row, "refinegold"),
    "num",
  );
  for (const index of slots) {
    const original = values.get(index)!,
      all = [...values.values()].map((value) => value.id),
      repeated = all.length - new Set(all).size;
    const id = choose(rules, row, new Set(repeated < repeats ? [original.id] : all), random),
      maximum = Number(generalPropertyRule(rules, original.id).max),
      next = Number(generalPropertyRule(rules, id).max);
    for (const map of maps) {
      const value = map.get(index);
      if (value) map.set(index, { ...value, id, value: round((next * value.value) / maximum) });
    }
  }
  return {
    row: {
      ...row,
      refineproperty: generalPropertiesContent(maps[0]!),
      refreshproperty: generalPropertiesContent(maps[1]!),
      oldrefineproperty: generalPropertiesContent(maps[2]!),
      refinegold: cityInteger(num(row, "refinegold") + cost + lockCost),
    },
    cost: cost + lockCost,
  };
}
