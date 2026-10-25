import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { text, num, type Row } from "@opencok/contracts/rows";
import type { RewardRandom } from "@opencok/contracts/rewards";
import type { Rule, Rules } from "./game";
import { cityInteger, cityAmount, type CityAsset } from "./city-progression";
const invalid = () => {
  throw new GameError(errors.invalid, "city_progression");
};
export function equipmentRule(rules: Rules, id: string) {
  const rule = rules.power.equipment?.get(id);
  if (!rule || rule.show === "no") invalid();
  return rule!;
}
export function equipmentPairs(raw: string | undefined) {
  const pairs = new Map<string, number>();
  for (const pair of raw?.split("|").filter(Boolean) ?? []) {
    const [id, count, ...extra] = pair.split(";");
    if (!id || !/^\d+$/.test(id) || extra.length) invalid();
    pairs.set(id!, cityInteger((pairs.get(id!) ?? 0) + cityInteger(count, 1)));
  }
  return pairs;
}
export function equipmentCosts(
  raw: string | undefined,
  reduction = 0,
  multiplier = 1,
): Partial<Record<CityAsset, bigint>> {
  const result: Partial<Record<CityAsset, bigint>> = {};
  for (const [id, count] of equipmentPairs(raw)) {
    const asset = (["wood", "stone", "iron", "food", "silver"] as const)[Number(id)];
    if (!asset) invalid();
    const value = cityAmount(
      Math.trunc(count * multiplier * (asset === "silver" ? Math.max(0, 1 - reduction / 100) : 1)),
    );
    result[asset!] = (result[asset!] ?? 0n) + value;
  }
  return result;
}
export function chooseWeight(weights: readonly number[], random: RewardRandom) {
  const values = weights.map((value) => {
    if (!Number.isFinite(value) || value < 0) invalid();
    return Math.floor(value * 100000);
  });
  const total = values.reduce((sum, value) => sum + value, 0);
  if (!Number.isSafeInteger(total) || total <= 0) invalid();
  let choice = random(total);
  if (!Number.isInteger(choice) || choice < 0 || choice >= total) invalid();
  for (let index = 0; index < values.length; index++) {
    if (choice < values[index]!) return index;
    choice -= values[index]!;
  }
  return invalid();
}
export function equipmentMaterials(
  rule: Rule,
  rules: Rules,
  tools: readonly number[],
  multiple: number,
  modern: boolean,
) {
  if (tools.length > 256 || (modern && tools.length !== 4)) invalid();
  const costs = new Map<string, number>(),
    colors: { color: number; weight: number }[] = [];
  const add = (id: string, count: number) =>
    costs.set(id, cityInteger((costs.get(id) ?? 0) + count, 1));
  for (let index = 0; index < 4; index++) {
    const recipe = rule[`material${index + 1}`];
    if (!recipe) {
      if (modern && tools[index] !== 0) invalid();
      continue;
    }
    const [base, raw] = recipe.split(";"),
      required = cityInteger(raw, 1),
      good = rules.goods.get(base!);
    if (!good) invalid();
    if (modern && good!.type2 === "999") {
      const count = cityInteger(tools[index], multiple, required * multiple);
      add(base!, count);
      const ratio = count / (required * multiple),
        ranges = (rules.items.get("equipment_combine")?.k3 ?? "").split("|");
      const color = ranges.findIndex((pair) => {
        const [lo, hi] = pair.split(";").map(Number);
        return ratio > lo! && ratio <= hi!;
      });
      if (color < 0) invalid();
      const [lo, hi] = ranges[color]!.split(";").map(Number);
      colors.push({ color, weight: ((ratio - lo!) / (hi! - lo!) + 1) * 6 });
    } else {
      const candidates = modern ? [cityInteger(tools[index])] : tools;
      const ids = candidates
        .map(String)
        .filter((id) =>
          good!.type === "7"
            ? Math.trunc(Number(id) / 10) === Math.trunc(Number(base) / 10)
            : id === base,
        );
      if (!ids.length || (modern && ids.length !== 1)) invalid();
      if (ids.length === 1) add(ids[0]!, required * multiple);
      else {
        if (ids.length !== required) invalid();
        for (const id of ids) add(id, multiple);
      }
      for (const id of ids) {
        if (!rules.goods.has(id)) invalid();
        colors.push({
          color: cityInteger(rules.goods.get(id)?.color ?? Number(id) % 10, 0, 5),
          weight: 1,
        });
      }
    }
  }
  return { costs, colors };
}
export function equipmentColor(
  rules: Rules,
  entries: readonly { color: number; weight: number }[],
  son: Row | undefined,
  modern: boolean,
  multiple: number,
  quality: number,
  random: RewardRandom,
) {
  const colors = Array.from({ length: 6 }, () => 0),
    config = rules.items.get("equip");
  for (const entry of entries) colors[cityInteger(entry.color, 0, 5)]! += entry.weight;
  if (son) {
    const rule = equipmentRule(rules, text(son, "itemId")),
      color = num(son, "itemId") % 10;
    const amount = modern
      ? Number(
          config?.k10
            ?.split("|")
            .map((pair) => pair.split(";"))
            .find(([level]) => Number(level) === Number(rule.level))?.[1] ?? 1,
        ) * (multiple === 5 ? 0.4 : 1)
      : Number(rule.level_material ?? 1);
    colors[color]! += amount;
  }
  const active = colors.flatMap((amount, index) => (amount > 0 ? [index] : []));
  if (!active.length) invalid();
  const min = active[0]!,
    max = active.at(-1)!;
  const base = (config?.k1 ?? "0|0|0|0|0|0").split("|").map(Number);
  const weights = Array.from({ length: 6 }, (_, index) => {
    if (index < min || index > max) return 0;
    const cumulative = colors.slice(0, index + 1).reduce((sum, value) => sum + value, 0);
    const rate = (config?.k9 ?? "0|0.5|0.5|0.5|0.5|0.5")
      .split("|")
      .map(Number)
      .slice(0, max - index + 1)
      .reduce((sum, value) => sum + value, 0);
    return colors[index]! + cumulative * rate;
  });
  const total = weights.reduce((sum, value) => sum + value, 0),
    fixed = base.slice(min).reduce((sum, value) => sum + value, 0);
  const probability = weights.map(
    (weight, index) =>
      (index >= min ? (base[index] ?? 0) : 0) + (total > 0 ? (weight / total) * (100 - fixed) : 0),
  );
  let shift = Math.min(Math.max(0, quality), 100 - probability[max]!);
  probability[max]! += shift;
  for (let index = 0; index < max && shift > 0; index++) {
    const take = Math.min(probability[index]!, shift);
    probability[index]! -= take;
    shift -= take;
  }
  return chooseWeight(probability, random);
}
export function randomEquipmentProperty(
  rule: Rule | undefined,
  color: number,
  random: RewardRandom,
  library?: number,
) {
  if (!rule) invalid();
  const rates = (rule!.rate ?? "").split("|").map(Number),
    types = rule!.libraryType?.split("|");
  const weights = rates.map((rate, index) =>
    library === undefined || Number(types?.[index]) === library ? rate : 0,
  );
  const index = chooseWeight(weights, random);
  const effect = rule!.effect?.split("|")[index]?.replaceAll(";", "@"),
    value = rule![`value${color}`]?.split("|")[index],
    dialog = rule!.dialog?.split("|")[index];
  if (!effect || value === undefined || !Number.isFinite(Number(value))) invalid();
  return `${effect},${value},${dialog ?? 0}`;
}
export function dismantleEquipment(rule: Rule, random: RewardRandom) {
  const result = new Map<string, number>();
  const add = (id: string, count: number) => {
    if (count > 0) result.set(id, cityInteger((result.get(id) ?? 0) + count));
  };
  if (rule.suitbreak_down !== undefined) {
    const min = Number(rule.suitbreak_down),
      max = Number(rule.suitbreak_up),
      k = Number(rule.suitbreak_k);
    if (![min, max, k].every(Number.isFinite) || min < 0 || min > max || max > 1 || k <= 0)
      invalid();
    for (let index = 1; index <= 4; index++)
      for (const [id, count] of equipmentPairs(rule[`material${index}`])) {
        const r = random(1000000) / 1000000,
          value = count * min + (((max - min) * k * r) / (k + 1 - r)) * count;
        add(
          id,
          Math.trunc(value) + (random(100) < Math.trunc((value - Math.trunc(value)) * 100) ? 1 : 0),
        );
      }
  } else if (rule.break_get) {
    const min = cityInteger(rule.break_down),
      max = cityInteger(rule.break_up, min, 100000),
      count = min + random(max - min + 1),
      ids = rule.break_get.split(";");
    for (let index = 0; index < count; index++) add(ids[random(ids.length)]!, 1);
  }
  for (const [id, count] of equipmentPairs(rule.break_get01)) add(id, count);
  return result;
}
