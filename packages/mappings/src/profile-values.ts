import { type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";

export function signed(value: unknown, bits: 32 | 64): bigint {
  if (value === null || value === undefined) return 0n;

  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new GameError(errors.unsupported, "public_profile");

  if (!/^[+-]?\d+$/.test(String(value))) throw new GameError(errors.unsupported, "public_profile");

  const parsed = BigInt(String(value));

  if (BigInt.asIntN(bits, parsed) !== parsed)
    throw new GameError(errors.unsupported, "public_profile");

  return parsed;
}

export function integer(row: Row, key: string) {
  return Number(signed(row[key], 32));
}
