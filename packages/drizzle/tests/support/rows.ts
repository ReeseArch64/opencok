import assert from "node:assert/strict";
import type { Column, NativeTable } from "./contract";

export type Row = Record<string, unknown>;

/** Values derive from native SQL types, independently of Drizzle's encoders. */
export function sampleValue([, type]: Column, variant: number): unknown {
  if (/^bigint/.test(type)) return 9007199254740992n + BigInt(variant);
  if (/^(?:int|tinyint|smallint|mediumint)/.test(type)) return variant;
  if (/^(?:float|double)/.test(type)) return /,0\)/.test(type) ? variant : variant + 0.25;
  if (/^decimal/.test(type)) {
    const scale = Number(type.match(/,\s*(\d+)\)/)?.[1] ?? 0);
    return `${variant}${scale ? `.${"25".padEnd(scale, "0").slice(0, scale)}` : ""}`;
  }
  if (/^(?:datetime|timestamp)/.test(type)) {
    const precision = Number(type.match(/\((\d+)\)/)?.[1] ?? 0);
    return `2020-01-0${variant} 12:34:56${precision ? `.${"1".repeat(precision)}` : ""}`;
  }
  if (type === "date") return `2020-01-0${variant}`;
  if (/^(?:var)?binary|blob/.test(type)) {
    const length = /^binary\(/.test(type) ? Number(type.match(/\((\d+)\)/)![1]) : Math.min(Number(type.match(/\((\d+)\)/)?.[1] ?? 6), 6);
    const value = Buffer.alloc(length, variant);
    if (length > 1) value[1] = 255;
    if (length > 2) value[2] = 0;
    return value;
  }
  if (/^(?:var)?char|text/.test(type)) {
    const length = Number(type.match(/\((\d+)\)/)?.[1] ?? 128);
    return `${variant}-synthetic-'\\-á`.slice(0, length);
  }
  throw new Error(`No fixture for SQL type ${type}`);
}

export function sampleRow(table: NativeTable, variant = 1): Row {
  const row = Object.fromEntries(table.columns.map((column) => [column[0], sampleValue(column, variant)]));
  for (const key of table.foreignKeys) {
    // Both legacy foreign keys reference logging_event.event_id (same bigint type).
    assert.equal(key[2], "logging_event");
    for (const column of key[1]) row[column] = 9007199254740993n;
  }
  return row;
}

export function literalDefault(column: Column): unknown {
  const [, type, , value] = column;
  if (value === null) return null;
  if (value === "current_timestamp()") throw new Error("Clock defaults need a server-clock assertion");
  const unquoted = value.startsWith("'") ? value.slice(1, -1).replaceAll("''", "'").replace(/\\(.)/gs, "$1") : value;
  if (type.startsWith("bigint")) return BigInt(unquoted);
  if (/^(?:int|tinyint|smallint|mediumint|float|double)/.test(type)) return Number(unquoted);
  if (type.startsWith("decimal")) {
    const scale = Number(type.match(/,(\d+)\)/)?.[1] ?? 0);
    const [integer, fraction = ""] = unquoted.split(".");
    return `${integer}${scale ? `.${fraction.padEnd(scale, "0")}` : ""}`;
  }
  if (/^(?:var)?binary|blob/.test(type)) return Buffer.from(unquoted);
  return unquoted;
}
