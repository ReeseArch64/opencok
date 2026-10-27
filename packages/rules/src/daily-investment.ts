import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import type { Rule } from "./game";
import { cityInteger } from "./city-progression";
export function investmentFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}
export function investmentDays(now: bigint, start: bigint): number {
  if (now < start || start < 0n) investmentFailure();
  return cityInteger(now / 86400000n - start / 86400000n);
}
export function investmentSchedule(rule: Rule): readonly number[] {
  const count = cityInteger(rule.time, 1, 64),
    values = (rule.interest ?? "").split(";");
  if (values.length !== count) investmentFailure();
  return values.map((value) => cityInteger(value));
}
export function investmentFlags(raw: string): string[] {
  if (!/^[01](;[01]){0,63}$/.test(raw)) investmentFailure();
  return raw.split(";");
}
export function localActivityConditions(
  raw: string | undefined,
  castle: number,
  vip: number,
  ageDays: number,
): boolean {
  if (!raw || raw.length > 8192) return false;
  const parts = raw.split("|");
  if (parts.length > 128) return false;
  return parts.every((part) => {
    const pair = part.split(";");
    if (pair.length !== 2 || !/^\d+$/.test(pair[1]!)) return false;
    const value = Number(pair[1]);
    if (!Number.isSafeInteger(value)) return false;
    switch (pair[0]) {
      case "1":
        return castle >= value;
      case "2":
        return castle <= value;
      case "3":
        return vip >= value;
      case "4":
        return vip <= value;
      case "5":
        return ageDays >= value;
      default:
        return false;
    }
  });
}
