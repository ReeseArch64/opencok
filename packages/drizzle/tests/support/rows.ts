import type { ColumnContract, TableContract } from "./schema";

export type Row = Record<string, unknown>;

export function sampleValue(column: ColumnContract, variant: number): unknown {
  if (column.calendar) {
    if (column.calendar === "date") return `2020-01-0${variant}`;
    const precision = Number(column.calendar.match(/\((\d+)\)/)?.[1] ?? 0);
    return `2020-01-0${variant} 12:34:56${precision ? `.${"1".repeat(precision)}` : ""}`;
  }
  if (column.value === "bigint") return 9007199254740992n + BigInt(variant);
  if (column.value === "number")
    return /^(?:numeric|real|double)/.test(column.type) && !/,0\)/.test(column.type)
      ? variant + 0.25
      : variant;
  if (column.value === "buffer") {
    const buffer = Buffer.alloc(column.bytes ?? 6, variant);
    if (buffer.length > 1) buffer[1] = 255;
    if (buffer.length > 2) buffer[2] = 0;
    return buffer;
  }
  if (column.type.startsWith("numeric")) {
    const scale = Number(column.type.match(/,(\d+)\)/)?.[1] ?? 0);
    return `${variant}${scale ? `.${"25".padEnd(scale, "0").slice(0, scale)}` : ""}`;
  }
  const length = Number(column.type.match(/\((\d+)\)/)?.[1] ?? 128);
  return `${variant}-synthetic-'\\-á`.slice(0, length);
}

export function sampleRow(spec: TableContract, variant = 1): Row {
  const row = Object.fromEntries(
    spec.columns.map((column) => [column.name, sampleValue(column, variant)]),
  );
  for (const key of spec.foreignKeys) for (const name of key.columns) row[name] = 9007199254740993n;
  return row;
}

export function literalDefault(column: ColumnContract): unknown {
  if (column.default === null) return null;
  const value = column.default.startsWith("'")
    ? column.default.slice(1, -1).replaceAll("''", "'")
    : column.default;
  if (column.value === "bigint") return BigInt(value);
  if (column.value === "number") return Number(value);
  if (column.value === "buffer") return Buffer.from(value);
  if (column.type.startsWith("numeric")) {
    const scale = Number(column.type.match(/,(\d+)\)/)?.[1] ?? 0);
    const [integer, fraction = ""] = value.split(".");
    return `${integer}${scale ? `.${fraction.padEnd(scale, "0")}` : ""}`;
  }
  return value;
}
