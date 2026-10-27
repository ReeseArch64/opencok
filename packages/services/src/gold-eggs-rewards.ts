import { previewRewards } from "@opencok/rules/rewards";
import { cityInteger } from "@opencok/rules/city-progression";
import { goldEggsFailure } from "@opencok/rules/gold-eggs";
import type { Rule } from "@opencok/rules/game";
import type { CityProgressionContext } from "./city-progression-context.ts";

const assets = [
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "exp",
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  "chip",
  "diamond",
  undefined,
  "dragon_food",
  "dragon_gold",
];

const scalars = [
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "exp",
  "power",
  "honor",
  "alliance_point",
  "casino",
  "gold_casino",
  "wbskill",
  "crystal",
  "material",
  "military",
  "milhonor",
];

function scale(raw: string, multiple: number, ceil: boolean) {
  const value = Math.fround(Math.fround(cityInteger(raw)) * Math.fround(multiple));

  return String(Math.min(2147483647, ceil ? Math.ceil(value) : Math.floor(value)));
}

export function pinGoldEggRewards(
  context: CityProgressionContext,
  ids: readonly string[],
  multiple: number,
  random: (maximum: number) => number,
) {
  cityInteger(multiple, 1, 10000);

  if (!ids.length) return "";

  if (ids.length > 4096) goldEggsFailure();

  const merged: Rule = {},
    rates: string[] = [],
    items: string[] = [],
    nums: string[] = [],
    circles: string[] = [];

  for (const id of ids) {
    const rule = context.rules.reconnect.rewards?.get(id);

    if (!rule) goldEggsFailure();

    for (const scalar of scalars)
      if (rule[scalar] !== undefined)
        merged[scalar] = String(
          cityInteger(Number(merged[scalar] ?? 0) + cityInteger(rule[scalar])),
        );

    if (rule.rate) {
      rates.push(...rule.rate.split("|"));
      items.push(...(rule.item ?? "").split("|"));
      nums.push(...(rule.num ?? "").split("|"));
      circles.push(...(rule.circle ?? "").split("|"));
    }
  }

  if (
    rates.length > 4096 ||
    rates.length !== items.length ||
    rates.length !== nums.length ||
    rates.length !== circles.length
  )
    goldEggsFailure();

  let draws = 0;

  for (let index = 0; index < rates.length; index++) {
    const guaranteed = rates[index] === "100";

    if (guaranteed)
      nums[index] = nums[index]!.split(";")
        .map((raw) => scale(raw, multiple, true))
        .join(";");
    else circles[index] = scale(circles[index]!, multiple, true);

    draws += cityInteger(circles[index]);
  }

  if (draws > 8192) goldEggsFailure();

  for (const scalar of scalars)
    if (merged[scalar] !== undefined) merged[scalar] = scale(merged[scalar]!, multiple, false);

  const ruleContext = {
    kingdomId: context.rules.kingdomId,
    version: "12.06.0",
    now: Number(context.now),
  };
  const values = [...previewRewards("gold-eggs", context.rules, ruleContext, random, merged)];

  if (rates.length) {
    const unique = new Set<string>();

    for (const row of previewRewards("gold-eggs", context.rules, ruleContext, random, {
      rate: rates.join("|"),
      item: items.join("|"),
      num: nums.join("|"),
      circle: circles.join("|"),
    })) {
      const key = row.kind === "item" ? `item:${row.id}` : `count:${row.type}`;

      if (unique.has(key)) continue;

      unique.add(key);
      values.push(row);
    }
  }

  return values
    .map((row) => {
      if (row.kind === "item") {
        if (row.count <= 0) goldEggsFailure();

        return `${row.type === 7 ? "goods" : "equip"},${row.id},${row.count}`;
      }

      if (row.kind === "count" && assets[row.type] && row.value > 0)
        return `${assets[row.type]},0,${row.value}`;

      return goldEggsFailure();
    })
    .join("|");
}
