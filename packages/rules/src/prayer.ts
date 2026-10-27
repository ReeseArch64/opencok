import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { text, num, long, type Row } from "@opencok/contracts/rows";
import { cityInteger } from "./city-progression";
import type { Rules } from "./game";

export const prayerFields = ["wood", "food", "iron", "silver", "steel"] as const;

export function prayerFailure(code: string = errors.invalid): never {
  throw new GameError(code, "city_progression");
}

export function prayerParameter(rules: Rules, altar: Row, index: number) {
  const definition = rules.building(
      text(altar, "itemId"),
      num(altar, "level"),
      num(altar, "star"),
      num(altar, "progress"),
    ),
    parameter = definition.clientParameters?.[index];

  if (!parameter) return "0";

  let value = parameter.value;

  for (const step of parameter.steps ?? [])
    if (step.progress <= num(altar, "progress")) value = step.value;

  return value;
}

export function prayerConfiguration(rules: Rules, altar: Row) {
  const amounts = prayerParameter(rules, altar, 0)
      .split(";")
      .map((value) => cityInteger(value)),
    weights = prayerParameter(rules, altar, 2)
      .split(";")
      .map((value) => Math.round(Number(value) * 10)),
    control = rules.items.get("resource_pray");

  if (
    amounts.length !== 4 ||
    weights.length !== 4 ||
    weights.some((weight) => !Number.isSafeInteger(weight) || weight < 0) ||
    weights.reduce((sum, weight) => sum + weight, 0) <= 0 ||
    !control
  )
    prayerFailure();

  return {
    base: {
      wood: amounts[0]!,
      food: amounts[1]!,
      iron: amounts[2]!,
      silver: amounts[3]!,
      steel: cityInteger(prayerParameter(rules, altar, 3)),
    },
    free: cityInteger(prayerParameter(rules, altar, 1)),
    maximum: cityInteger(control.k5, 1),
    initialGold: cityInteger(control.k1),
    goldStep: cityInteger(control.k2),
    maximumGold: cityInteger(control.k3),
    growth: Number(control.k4) / 1000,
    weights,
  };
}

export function prayerInteger(value: number) {
  if (!Number.isFinite(value) || value < 0) prayerFailure();

  return Math.min(2147483647, Math.trunc(value));
}

export function prayerSteel(base: number, effect: number) {
  return prayerInteger(Math.fround(Math.fround(base) * Math.fround(1 + Math.fround(effect / 100))));
}

export function resetPrayer(
  previous: Row | undefined,
  owner: string,
  now: bigint,
  base: ReturnType<typeof prayerConfiguration>["base"],
): Row {
  const row: Row = previous
    ? { ...previous }
    : { uid: owner, freeFromItem: 0, isFirstFree: 1, isFirstPay: 1 };

  if (!previous || long(row, "lastPrayTime") / 86400000n !== now / 86400000n) {
    Object.assign(row, base, { prayCount: 0, itemPrayCount: 0, lastPrayTime: now });

    for (const key of prayerFields) row[`gold${key}`] = 0;
  }

  return row;
}

export function prayerHit(
  first: boolean,
  weights: readonly number[],
  random: (maximum: number) => number,
) {
  const maximum = first ? 3 : weights.reduce((sum, value) => sum + value, 0),
    roll = random(maximum);

  if (!Number.isInteger(roll) || roll < 0 || roll >= maximum) prayerFailure();

  if (first) return [2, 5, 10][roll]!;

  let cumulative = 0;

  for (const [index, weight] of weights.entries()) {
    cumulative += weight;

    if (roll < cumulative) return [1, 2, 5, 10][index]!;
  }

  return prayerFailure();
}
