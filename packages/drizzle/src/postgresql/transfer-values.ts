import { createHash } from "node:crypto";
import type { ColumnMapping, TableMapping } from "./model";

export class TransferError extends Error {
  constructor(readonly stage: string, readonly table = "catalog", readonly column?: string, readonly databaseCode?: string) {
    super(`Legacy transfer failed: ${stage}, ${table}${column ? `.${column}` : ""}${databaseCode ? ` (${databaseCode})` : ""}`);
    this.name = "TransferError";
  }
}

export function canonicalValue(value: unknown, column: ColumnMapping, tableId: string): string | null {
  if (value === null) {
    if (column.notNull) throw new TransferError("unexpected-null", tableId, column.name);
    return null;
  }
  try {
    if (column.adapter === "bigint") {
      if (typeof value === "number" && !Number.isSafeInteger(value)) throw new Error();
      return BigInt(value as string | bigint).toString();
    }
    if (column.adapter === "number") {
      const number = Number(value);
      if (!Number.isFinite(number)) throw new Error();
      return Object.is(number, -0) ? "-0" : number.toString();
    }
    if (column.adapter === "bytes") {
      if (!Buffer.isBuffer(value) || value.length > 1_000_000_000) throw new Error();
      return value.toString("hex");
    }
    if (typeof value !== "string" || value.includes("\0") || Buffer.byteLength(value) > 1_000_000_000) throw new Error();
    if (column.adapter === "decimal" && !/^-?\d+(?:\.\d+)?$/.test(value)) throw new Error();
    return value;
  } catch { throw new TransferError("unrepresentable-value", tableId, column.name); }
}

/** Order-independent cryptographic multiset digest retains duplicate counts for keyless tables. */
export class RowDigest {
  private sum = 0n;
  private fields: bigint[] = [];
  count = 0n;
  add(row: Record<string, unknown>, table: TableMapping) {
    const values = table.columns.map((column) => canonicalValue(row[column.name], column, table.id));
    const digest = createHash("sha256").update(JSON.stringify(values)).digest("hex");
    this.sum = (this.sum + BigInt(`0x${digest}`)) % (1n << 256n);
    for (const [i, value] of values.entries()) {
      const field = createHash("sha256").update(JSON.stringify(value)).digest("hex");
      this.fields[i] = ((this.fields[i] ?? 0n) + BigInt(`0x${field}`)) % (1n << 256n);
    }
    this.count++;
  }
  result() { return createHash("sha256").update(`${this.count}:${this.sum.toString(16).padStart(64, "0")}`).digest("hex"); }
  differingFields(other: RowDigest, table: TableMapping) {
    return table.columns.filter((_, i) => this.fields[i] !== other.fields[i]).map((column) => column.name);
  }
}

export function driverValue(value: unknown, column: ColumnMapping, tableId: string): unknown {
  const canonical = canonicalValue(value, column, tableId);
  if (canonical === null) return null;
  if (column.adapter === "bytes") return value;
  if (column.adapter === "number") return Number(canonical);
  return canonical;
}
