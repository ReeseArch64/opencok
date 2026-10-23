import { expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { getTableName } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import inventory from "../inventory.json";
import { legacyDriverOptions } from "../src/client";
import fixture from "./fixtures/mariadb-contract.json";
import { catalog, migrationHashes, runtimeContract, type Contract } from "./support/contract";
import { sampleRow } from "./support/rows";

const contract = fixture as unknown as Contract;
const db = drizzle.mock();

test("catalog covers every native table, source module and all 6,316 columns", async () => {
  expect(catalog.map((entry) => entry.id)).toEqual(Object.keys(contract.tables).sort());
  expect(catalog).toHaveLength(772);
  expect(catalog.reduce((count, entry) => count + entry.config.columns.length, 0)).toBe(6316);
  expect(await migrationHashes()).toEqual(contract.migrations);
  for (const [database, count] of Object.entries(inventory.databases)) {
    const entries = catalog.filter((entry) => entry.database === database);
    expect(entries).toHaveLength(count);
    expect((await readdir(new URL(`../src/schema/${database}/`, import.meta.url))).sort())
      .toEqual(entries.map((entry) => `${entry.config.name}.ts`).sort());
    for (const entry of entries) {
      const exports = Object.values(await import(`../src/schema/${database}/${entry.config.name}.ts`));
      expect(exports).toEqual([entry.table]);
    }
  }
  expect(Object.values(contract.tables).filter((table) => table.engine === "MyISAM")).toHaveLength(5);
  expect(Object.values(contract.tables).filter((table) => !table.indexes.some((key) => key[0] === "PRIMARY"))).toHaveLength(34);
});

test("driver keeps exact integers, decimals, temporal strings and single statements", () => {
  expect(legacyDriverOptions).toEqual({ supportBigNumbers: true, bigNumberStrings: true,
    decimalNumbers: false, dateStrings: true, timezone: "Z", multipleStatements: false });
});

for (const entry of catalog) {
  test(`${entry.id}: native column/key contract and parameter binding`, () => {
    const expected = contract.tables[entry.id]!;
    const { columns, indexes, foreignKeys } = expected;
    expect(runtimeContract(entry)).toEqual({ columns, indexes, foreignKeys });
    expect(getTableName(entry.table)).toBe(entry.config.name);
    const row = sampleRow(expected);
    const query = db.insert(entry.table).values(row).toSQL();
    expect(query.params).toHaveLength(columns.length);
    expect(query.sql.match(/\?/g)).toHaveLength(columns.length);
    for (const [i, column] of entry.config.columns.entries()) {
      const value = row[column.name];
      expect(query.params[i]).toEqual(column.mapToDriverValue(value));
      const wire = typeof value === "bigint" ? value.toString() : value;
      expect(column.mapFromDriverValue(wire)).toEqual(value);
    }
  });
}
