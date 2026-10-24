import { expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import { SQL } from "drizzle-orm";
import { PgDialect, getTableConfig } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { createDatabase, databaseSchemas } from "../src";
import { catalog, contract, normalizeType } from "./support/schema";
import { sampleRow } from "./support/rows";

const dialect = new PgDialect();
const db = drizzle.mock();

test("application inventory contains all 774 tables and 6,323 fields", async () => {
  expect(catalog.map((entry) => entry.id)).toEqual(Object.keys(contract).sort());
  expect(catalog).toHaveLength(774);
  expect(catalog.reduce((n, entry) => n + entry.config.columns.length, 0)).toBe(6323);
  for (const namespaces of Object.values(databaseSchemas))
    for (const namespace of namespaces) {
      expect(
        (await readdir(new URL(`../src/schema/${namespace}/`, import.meta.url))).sort(),
      ).toEqual(
        catalog
          .filter((entry) => entry.namespace === namespace)
          .map((entry) => `${entry.config.name}.ts`)
          .sort(),
      );
    }
  expect(catalog.filter((entry) => entry.spec.role === "global")).toHaveLength(113);
  expect(catalog.filter((entry) => entry.spec.role === "kingdom")).toHaveLength(661);
});

test("package entrypoint exposes role-specific typed PostgreSQL queries without connecting on import", async () => {
  const global = createDatabase("global", { max: 1 });
  const realm = createDatabase("kingdom", { max: 1 });
  try {
    expect(global.pool.totalCount).toBe(0);
    expect(realm.pool.totalCount).toBe(0);
    expect(global.db.query.opencok_global_usermapping.findMany().toSQL().sql).toContain(
      '"opencok_global"."usermapping"',
    );
    expect(realm.db.query.userprofile.findMany().toSQL().sql).toContain(
      '"opencok_kingdom"."userprofile"',
    );
    expect(() => createDatabase("invalid" as never, {})).toThrow("Unknown database role");
  } finally {
    await global.close();
    await realm.close();
  }
});

for (const { id, namespace, table, config, spec } of catalog) {
  test(`${id}: field, key, default and driver contract`, async () => {
    expect(config.name).toBe(id.slice(namespace.length + 1));
    expect(config.schema).toBe(namespace);
    expect(config.columns.map((column) => column.name)).toEqual(
      spec.columns.map((column) => column.name),
    );
    expect(
      config.primaryKeys.map((key) => [key.name, key.columns.map((column) => column.name)]),
    ).toEqual(
      spec.indexes
        .filter((index) => index.kind === "primary")
        .map((index) => [index.name, index.columns.map((column) => column.name)]),
    );
    expect(config.indexes.map(({ config: index }) => [index.name, !!index.unique])).toEqual(
      spec.indexes
        .filter((index) => index.kind !== "primary")
        .map((index) => [index.name, index.kind === "unique"]),
    );
    expect(config.checks.map((check) => [check.name, dialect.sqlToQuery(check.value).sql])).toEqual(
      spec.checks,
    );
    expect(
      config.foreignKeys.map((key) => {
        const ref = key.reference();
        return {
          name: key.getName(),
          columns: ref.columns.map((column) => column.name),
          table: getTableConfig(ref.foreignTable).name,
          targetColumns: ref.foreignColumns.map((column) => column.name),
          onDelete: String(key.onDelete),
          onUpdate: String(key.onUpdate),
        };
      }),
    ).toEqual(spec.foreignKeys);
    const row = sampleRow(spec);
    const query = db.insert(table).values(row).toSQL();
    expect(query.params).toHaveLength(spec.columns.length);
    for (const [i, column] of config.columns.entries()) {
      const expected = spec.columns[i]!;
      expect(normalizeType(column.getSQLType())).toBe(expected.type);
      expect(column.notNull).toBe(expected.notNull);
      expect(!!column.onUpdateFn).toBe(expected.onUpdate);
      expect(column.default instanceof SQL ? dialect.sqlToQuery(column.default).sql : null).toBe(
        expected.default,
      );
      expect(column.generatedIdentity?.type ?? null).toBe(expected.identity ? "byDefault" : null);
      if (expected.identity) {
        expect(column.generatedIdentity?.sequenceName).toBe(expected.identity.name);
        expect(column.generatedIdentity?.sequenceOptions?.startWith).toBe(
          expected.identity.startWith,
        );
      }
      const value = row[column.name];
      expect(column.mapFromDriverValue(column.mapToDriverValue(value))).toEqual(value);
    }
    expect(Object.values(await import(`../src/schema/${namespace}/${config.name}.ts`))).toEqual([
      table,
    ]);
  });
}
