import type { Row } from "@opencok/contracts/rows";

export function text(value: unknown, limit: number): value is string {
  return (
    typeof value === "string" &&
    value.length <= limit &&
    value.isWellFormed() &&
    !value.includes("\0")
  );
}

export function integer(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= -2147483648 &&
    value <= 2147483647
  );
}

export function long(value: unknown): boolean {
  return typeof value === "bigint" && BigInt.asIntN(64, value) === value;
}

export function rows(
  values: readonly Row[],
  uid: string,
  key: (row: Row) => string,
  valid: (row: Row) => boolean,
) {
  if (
    values.length > 4096 ||
    values.some((row) => row.uid !== uid || !valid(row)) ||
    new Set(values.map(key)).size !== values.length
  )
    {throw new Error("Invalid resource owner records");}
}

export function nullableText(value: unknown, limit: number): boolean {
  return value === null || text(value, limit);
}

export function nullableInteger(value: unknown): boolean {
  return value === null || integer(value);
}
