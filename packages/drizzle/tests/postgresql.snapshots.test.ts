import { expect, test } from "bun:test";
import { eq, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgDialect } from "drizzle-orm/pg-core";
import artifact from "./fixtures/mariadb-contract.json";
import type { Contract } from "./support/contract";
import { pgCatalog } from "./support/pg-catalog";
import { sampleRow } from "./support/rows";

const native = artifact as unknown as Contract;
const db = drizzle.mock();
const dialect = new PgDialect();
for (const { mapping, config, table } of pgCatalog) {
  test(`${mapping.id}: PostgreSQL schema and parameterized CRUD`, () => {
    const row = sampleRow(native.tables[mapping.id]!);
    const first = config.columns[0]!;
    const where = eq(first, row[first.name]);
    expect([
      `schema ${config.schema}`,
      ...config.columns.map((column) => `column ${JSON.stringify([column.name, column.getSQLType(), column.notNull,
        column.default instanceof SQL ? dialect.sqlToQuery(column.default).sql : null,
        column.generatedIdentity ?? null])}`),
      ...config.primaryKeys.map((key) => `primary ${JSON.stringify([key.name, key.columns.map((column) => column.name)])}`),
      ...config.indexes.map(({ config: index }) => `index ${JSON.stringify([index.name, index.unique, index.columns.map((column) => "name" in column ? column.name : dialect.sqlToQuery(column as SQL).sql)])}`),
      ...config.checks.map((check) => `check ${JSON.stringify([check.name, dialect.sqlToQuery(check.value).sql])}`),
      ...config.foreignKeys.map((key) => {
        const ref = key.reference();
        return `foreignKey ${JSON.stringify([key.getName(), ref.columns.map((column) => column.name), ref.foreignColumns.map((column) => column.name), key.onUpdate, key.onDelete])}`;
      }),
      db.insert(table).values(row).toSQL().sql,
      db.select().from(table).where(where).toSQL().sql,
      db.update(table).set(row).where(where).toSQL().sql,
      db.delete(table).where(where).toSQL().sql,
    ].join("\n")).toMatchSnapshot();
  });
}
