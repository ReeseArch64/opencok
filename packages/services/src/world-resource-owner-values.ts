import type { Row } from "@opencok/contracts/rows";

export function ownerInteger(value: unknown): number {
  if (value === null) return 0;

  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    throw new Error("Invalid saved general integer");

  return value;
}

export function ownerText(value: unknown, limit: number): string | null {
  if (value === null) return null;

  if (typeof value !== "string" || value.length > limit)
    throw new Error("Invalid saved general text");

  return value;
}

export function ownerLong(value: unknown): bigint | null {
  if (value === null) return null;

  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value)
    throw new Error("Invalid saved general long");

  return value;
}

export function ownerRecords(rows: readonly Row[]): readonly Row[] {
  if (rows.length > 4096) throw new Error("Too many saved general records");

  return rows;
}
