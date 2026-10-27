import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rule } from "./game";
import { cityInteger } from "./city-progression";

export function lotteryFailure(): never {
  throw new GameError(errors.locked, "city_progression");
}

export function lotteryCondition(
  rule: Rule,
  castle: number,
  level: number,
  spins: number,
  chests: number,
  daily: number,
  now: bigint,
) {
  const date = new Date(Number(now));
  const firstWeekday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)).getUTCDay();
  const week = Math.floor((date.getUTCDate() - 1 + firstWeekday) / 7);

  return (rule.condition ?? "")
    .split("|")
    .filter(Boolean)
    .every((raw) => {
      const [type, value] = raw.split(";").map(Number);

      if (!Number.isInteger(type) || !Number.isInteger(value)) lotteryFailure();

      switch (type) {
        case 1:
          return castle <= value!;
        case 2:
          return castle >= value!;
        case 3:
          return level <= value!;
        case 4:
          return level >= value!;
        case 5:
          return spins >= value!;
        case 6:
          return chests >= value!;
        case 7:
          return daily <= value!;
        case 8:
          return spins < value!;
        case 9:
          return chests < value!;
        case 10:
          return week === value;
        default:
          return false;
      }
    });
}

export function lotterySlots(raw: string) {
  const slots = raw.split("|");

  if (slots.length !== 9) lotteryFailure();

  return slots.map((slot) => {
    const pair = slot.split(":");

    if (pair.length !== 2) lotteryFailure();

    return { id: String(cityInteger(pair[0])), count: cityInteger(pair[1]) };
  });
}

export function lotteryResourceAmount(
  base: number,
  level: number,
  coefficient: number,
  spread: number,
  draw: number,
) {
  if (!Number.isInteger(draw) || draw < 0 || draw > spread * 2) lotteryFailure();

  const multiplier = Math.fround(1 + Math.fround(Math.fround(level * coefficient) / 100));
  const variation = Math.fround(1 + Math.fround(Math.fround(draw - spread) / 100));

  return cityInteger(Math.floor(Math.fround(Math.fround(base * multiplier) * variation) + 0.5));
}
