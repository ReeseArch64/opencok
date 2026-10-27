import { num, type Row } from "@opencok/contracts/rows";
import type { Rules, Rule } from "./game";
import { chooseWeight } from "./equipment";
import { cityInteger } from "./city-progression";
import { worldMutationFailure } from "./world-march-runtime";

export function worldResourceDuration(rules: Rules, level: number, dead = false) {
  const hours = Number(rules.items.get(dead ? "resources_death" : "resources_life")?.[`k${level}`]);
  const duration = Math.trunc(hours * 3600000);
  if (!Number.isSafeInteger(duration) || duration <= 0) worldMutationFailure();
  return BigInt(duration);
}
export function worldResourceAreaCount(rules: Rules, size: number) {
  const width = cityInteger(rules.items.get("worldmap_city")?.k6, 1);
  return Math.ceil(size / width) ** 2;
}
export function worldResourceQuota(rules: Rules) {
  const width = cityInteger(rules.items.get("worldmap_city")?.k6, 1),
    ratio = Math.fround(cityInteger(rules.items.get("worldmap_city")?.k7, 0, 100) / 100);
  return Math.trunc(Math.fround(width * width * ratio));
}
export function worldResourceChoice(
  rules: Rules,
  group: readonly Rule[],
  point: Row,
  size: number,
  age: bigint,
  effects: ReadonlyMap<number, number>,
  goldBonus: boolean,
  random: (maximum: number) => number,
) {
  const bandWidth = cityInteger(rules.items.get("worldmap_city")?.k4, 1),
    center = Math.trunc((size - 1) / 2),
    band = Math.max(
      Math.ceil(Math.abs(num(point, "x") - center) / bandWidth),
      Math.ceil(Math.abs(num(point, "y") - center) / bandWidth),
    );
  if (band === 0) return undefined;
  const choices = group.filter(
    (rule) => Number(rule.area_level) === band && BigInt(cityInteger(rule.hours)) * 3600000n <= age,
  );
  if (!choices.length) return undefined;
  const goldRatio = goldBonus ? Math.fround(Number(rules.items.get("17_wk")?.k11 ?? 0) / 100) : 0;
  const selected =
    choices[
      chooseWeight(
        choices.map((rule) => {
          const weight = cityInteger(rule.ratio);
          return rule.res_type === "5" && goldRatio > 0
            ? Math.floor(Math.fround(weight * Math.fround(1 + goldRatio)))
            : weight;
        }),
        random,
      )
    ];
  if (!selected) worldMutationFailure();
  const type = cityInteger(selected.res_type, 0, 6),
    level = cityInteger(selected.res_level, 1, 10);
  if (type === 6) return { type, level, amount: 0 };
  const key = [
    "world_wood",
    "world_stone",
    "world_iron",
    "world_food",
    "world_fineiron",
    "world_gold",
  ][type]!;
  let amount = cityInteger(rules.items.get(key)?.[`k${level}`], 1);
  if (type !== 5) {
    const ratio = Math.fround(
      Math.fround((effects.get(305) ?? 0) / 100) + Math.fround((effects.get(307) ?? 0) / 100),
    );
    amount = cityInteger(Math.trunc(Math.fround(amount * Math.fround(1 + ratio))), 1);
  }
  return { type, level, amount };
}
