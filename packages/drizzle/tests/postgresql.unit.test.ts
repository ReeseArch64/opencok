import { expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { SQL } from "drizzle-orm";
import { getTableConfig, PgDialect } from "drizzle-orm/pg-core";
import { buildManifest, ident, objectName } from "../scripts/postgresql/model";
import { generatePostgres } from "../scripts/postgresql/generate";
import { manifest } from "../src/postgresql/manifest";
import * as schemas from "../src/postgresql/schema";
import fixture from "./fixtures/mariadb-contract.json";
import { normalizeDefault, type Contract } from "./support/contract";
import { sampleRow } from "./support/rows";

const native = fixture as unknown as Contract;
export const pgCatalog = manifest.tables.map((mapping) => {
  const table = Object.values(schemas[mapping.namespace]).find((table) => getTableConfig(table).name === mapping.name)!;
  if (!table) throw new Error(`Missing PostgreSQL table ${mapping.id}`);
  return { mapping, table, config: getTableConfig(table) };
});
const dialect = new PgDialect();
const type = (value: string) => value.replaceAll(", ", ",");

test("PostgreSQL manifest covers every source table, field and module without truncation", async () => {
  expect(manifest.tables.map((table) => table.id)).toEqual(Object.keys(native.tables).sort());
  expect(manifest.tables).toHaveLength(772);
  expect(manifest.tables.reduce((n, table) => n + table.columns.length, 0)).toBe(6316);
  expect(manifest.sourceHashes).toEqual(native.migrations);
  expect(await buildManifest()).toEqual(manifest);
  await generatePostgres(true);
  for (const namespace of Object.keys(schemas) as (keyof typeof schemas)[]) {
    const entries = pgCatalog.filter(({ mapping }) => mapping.namespace === namespace);
    expect(Object.values(schemas[namespace])).toHaveLength(entries.length);
    expect((await readdir(new URL(`../src/postgresql/schema/${namespace}/`, import.meta.url))).sort()).toEqual(entries.map(({ mapping }) => `${mapping.name}.ts`).sort());
    const relations = new Set<string>();
    for (const { mapping } of entries) for (const index of mapping.indexes) {
      expect(Buffer.byteLength(index.targetName)).toBeLessThanOrEqual(63);
      expect(relations.has(index.targetName)).toBe(false); relations.add(index.targetName);
    }
  }
  expect(manifest.tables.filter((table) => table.role === "realm")).toHaveLength(659);
  expect(manifest.tables.filter((table) => table.role === "global")).toHaveLength(113);
  expect(manifest.programs).toHaveLength(9);
  expect(() => ident("x".repeat(64))).toThrow();
  expect(objectName("x".repeat(60), "long_index")).toHaveLength(61);
});

for (const { mapping, config, table } of pgCatalog) {
  test(`${mapping.id}: PostgreSQL preserves the native source contract and value adapters`, async () => {
    const expected = native.tables[mapping.id]!;
    expect(config.name).toBe(mapping.name); expect(config.schema).toBe(mapping.namespace);
    expect(mapping.sourceEngine).toBe(expected.engine); expect(mapping.sourceCollation).toBe(expected.collation);
    expect(mapping.columns.map((column) => [column.name, column.sourceType, column.notNull,
      normalizeDefault(column.defaultSql, column.sourceType), column.autoIncrement, column.onUpdate])).toEqual(expected.columns);
    expect(mapping.columns.map((column) => [column.name, column.charset, column.collation, column.comment])).toEqual(expected.columnAttributes);
    expect(config.columns.map((column) => column.name)).toEqual(expected.columns.map((column) => column[0]));
    expect(config.primaryKeys.flatMap((key) => key.columns.map((column) => column.name))).toEqual(expected.indexes.find((index) => index[0] === "PRIMARY")?.[2].map((column) => column[0]) ?? []);
    expect(mapping.indexes.filter((index) => index.kind !== "pad-unique").map((index) => [index.sourceName, index.kind !== "index", index.columns.map((column) => [column.name, column.prefix]), "BTREE"]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))).toEqual(expected.indexes);
    expect(config.indexes).toHaveLength(mapping.indexes.filter((index) => index.kind !== "primary").length);
    expect(config.foreignKeys).toHaveLength(expected.foreignKeys.length);
    const row = sampleRow(expected);
    for (const [i, column] of config.columns.entries()) {
      const spec = mapping.columns[i]!;
      expect(type(column.getSQLType())).toBe(`${spec.targetType}${spec.targetCollation ? ` COLLATE ${spec.targetCollation === "C" ? '"C"' : spec.targetCollation.split(".").map((part) => `"${part}"`).join(".")}` : ""}`);
      expect(column.notNull).toBe(spec.notNull);
      if (spec.targetDefault !== null) {
        expect(column.default).toBeInstanceOf(SQL);
        expect(dialect.sqlToQuery(column.default as SQL).sql).toBe(spec.targetDefault);
      }
      const value = row[column.name];
      const encoded = column.mapToDriverValue(value);
      expect(column.mapFromDriverValue(encoded)).toEqual(value);
    }
    const exports = Object.values(await import(`../src/postgresql/schema/${mapping.namespace}/${mapping.name}.ts`));
    expect(exports).toEqual([table]);
  });
}
