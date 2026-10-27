import type { Rule } from "./game";
import { cityInteger } from "./city-progression";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";

export function vipBoxFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export function vipBoxBand(rules: readonly Rule[], level: number): number {
  const bands = [...new Set(rules.map((row) => cityInteger(row.vip, 1, 255)))];

  if (!bands.length || bands.length > 128) vipBoxFailure();

  return Math.max(0, ...bands.filter((value) => value <= level)) || 8;
}

export function vipBoxIndices(value: string, length: number): readonly number[] {
  if (!value) return [];

  const tokens = value.replace(/,$/, "").split(","),
    indices = tokens.map((value) => cityInteger(value, 0, length - 1));

  if (new Set(indices).size !== indices.length || indices.length > length) vipBoxFailure();

  return indices;
}

export function vipBoxWeighted(
  weights: readonly number[],
  random: (maximum: number) => number,
): number {
  const total = cityInteger(
      weights.reduce((sum, weight) => sum + cityInteger(weight), 0),
      1,
    ),
    draw = cityInteger(random(total), 0, total - 1);
  let sum = 0;

  for (let index = 0; index < weights.length; index++) {
    sum += weights[index]!;

    if (draw < sum) return index;
  }

  return vipBoxFailure();
}

export function vipBoxContents(rule: Rule) {
  const items = (rule.item ?? "").split(";"),
    counts = (rule.item_num ?? "").split(";").map((value) => cityInteger(value, 1)),
    weights = (rule.rate ?? "").split(";").map((value) => cityInteger(value));

  if (
    !items.length ||
    items.length > 64 ||
    counts.length !== items.length ||
    weights.length !== items.length ||
    items.some((item) => !/^\d{1,40}$/.test(item))
  )
    vipBoxFailure();

  const costs = (rule.deplete_num ?? "").split(";").map((value) => cityInteger(value, 1));

  if (!rule.deplete || costs.length < items.length - 1) vipBoxFailure();

  return { items, counts, weights, costs };
}
