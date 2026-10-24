import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function invalidEffect(): never {
  throw new GameError(errors.unsupported, "power_effect");
}

export function effectInteger(raw: unknown): number {
  if (!/^[+-]?\d+$/.test(String(raw))) return invalidEffect();
  const value = Number(raw);
  if (!Number.isInteger(value) || value < -2147483648 || value > 2147483647) return invalidEffect();
  return value;
}

export function effectLong(raw: unknown): bigint {
  if (
    (typeof raw !== "bigint" && typeof raw !== "string" && typeof raw !== "number") ||
    (typeof raw === "number" && !Number.isSafeInteger(raw)) ||
    !/^[+-]?\d+$/.test(String(raw))
  )
    return invalidEffect();
  const value = BigInt(raw);
  if (BigInt.asIntN(64, value) !== value) return invalidEffect();
  return value;
}

export function effectFloat(raw: unknown): number {
  if (
    (typeof raw !== "number" && typeof raw !== "string") ||
    !/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(String(raw).trim())
  )
    return invalidEffect();
  const value = Math.fround(Number(raw));
  if (!Number.isFinite(value)) return invalidEffect();
  return value;
}
