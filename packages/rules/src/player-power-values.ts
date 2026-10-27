import { type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rule } from "@opencok/rules/game";

export const i32 = (value: bigint) => Number(BigInt.asIntN(32, value));

export const i64 = (value: bigint) => BigInt.asIntN(64, value);

export function integer(value: unknown, fallback = 0n): bigint {
  if (value === undefined || value === null) {return fallback;}

  if (!/^[+-]?\d+$/.test(String(value))) {throw new GameError(errors.unsupported, "power_rule");}

  const result = BigInt(String(value));

  if (result < -2147483648n || result > 2147483647n)
    {throw new GameError(errors.unsupported, "power_rule");}

  return result;
}

export function record(catalog: Map<string, Rule> | undefined, id: string): Rule {
  const rule = catalog?.get(id);

  if (!rule) {throw new GameError(errors.unsupported, "power_rule");}

  return rule;
}

export function sumInt(rows: readonly Row[], power: (row: Row) => bigint): number {
  return i32(rows.reduce((sum, row) => sum + power(row), 0n));
}
