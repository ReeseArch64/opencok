import { expect, test } from "bun:test";
import { pgTable } from "drizzle-orm/pg-core";
import { manifest } from "../src/postgresql/manifest";
import { canonicalValue, RowDigest } from "../src/postgresql/transfer-values";
import { legacyBytes, legacyNumber, legacyText, unsignedBigint } from "../src/postgresql/types";

const table = manifest.tables.find((table) => table.id === "cokdb1.ability_page")!;
const row = { uid: "synthetic", page: 1, ability: Buffer.from([0, 255, 0]) };
test("reconciliation is order independent and detects duplicate loss and specific changed fields", () => {
  const original = new RowDigest(), reordered = new RowDigest(), missing = new RowDigest(), changed = new RowDigest();
  for (const value of [row, { ...row, page: 2 }, row]) original.add(value, table);
  for (const value of [{ ...row, page: 2 }, row, row]) reordered.add(value, table);
  for (const value of [row, { ...row, page: 2 }]) missing.add(value, table);
  for (const value of [row, { ...row, page: 3 }, row]) changed.add(value, table);
  expect(original.result()).toBe(reordered.result());
  expect(original.result()).not.toBe(missing.result());
  expect(original.result()).not.toBe(changed.result());
  expect(original.differingFields(changed, table)).toEqual(["page"]);
  expect(original.count).toBe(3n);
});
test("unrepresentable source values fail with sanitized table/field diagnostics", () => {
  const bigint = manifest.tables.flatMap((table) => table.columns).find((column) => column.adapter === "bigint")!;
  expect(() => canonicalValue(9007199254740992, bigint, "synthetic")).toThrow("unrepresentable-value");
  expect(() => canonicalValue("private\0value", table.columns[0]!, table.id)).toThrow("unrepresentable-value, cokdb1.ability_page.uid");
  try { canonicalValue("private\0value", table.columns[0]!, table.id); } catch (error) { expect(String(error)).not.toContain("private"); }
  expect(canonicalValue(Buffer.from([0, 255]), table.columns[2]!, table.id)).toBe("00ff");
});
test("PostgreSQL adapters reject precision loss, out-of-range uint64 and invalid text/bytes", () => {
  const columns = pgTable("synthetic", { id: unsignedBigint("id"), number: legacyNumber("number", { sqlType: "real" }), text: legacyText("text", { sqlType: "text", collation: "C" }), bytes: legacyBytes("bytes") });
  const unsigned = columns.id;
  expect(unsigned.mapFromDriverValue("18446744073709551615")).toBe(18446744073709551615n);
  expect(() => unsigned.mapToDriverValue(18446744073709551616n)).toThrow();
  expect(() => unsigned.mapToDriverValue(-1n)).toThrow();
  const number = columns.number;
  expect(() => number.mapToDriverValue(Infinity)).toThrow();
  const text = columns.text;
  expect(() => text.mapToDriverValue("a\0b")).toThrow();
  const bytes = columns.bytes;
  expect(() => bytes.mapToDriverValue("bytes")).toThrow();
});
