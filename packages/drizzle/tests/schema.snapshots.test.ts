import { expect, test } from "bun:test";
import { eq, SQL } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { PgDialect } from "drizzle-orm/pg-core";
import { catalog } from "./support/schema";
import { sampleRow } from "./support/rows";

const db = drizzle.mock();
const dialect = new PgDialect();
for (const { id, table, config, spec } of catalog) {
  test(`${id}: schema and CRUD SQL`, () => {
    const row = sampleRow(spec),
      column = config.columns[0]!;
    const where = eq(column, row[column.name]);
    expect(
      [
        `schema ${config.schema}`,
        ...config.columns.map(
          (column) =>
            `column ${JSON.stringify([
              column.name,
              column.getSQLType(),
              column.notNull,
              column.default instanceof SQL ? dialect.sqlToQuery(column.default).sql : null,
              column.generatedIdentity ?? null,
              column.onUpdateFn ? dialect.sqlToQuery(column.onUpdateFn() as SQL).sql : null,
            ])}`,
        ),
        ...config.primaryKeys.map(
          (key) =>
            `primary ${JSON.stringify([key.name, key.columns.map((column) => column.name)])}`,
        ),
        ...config.indexes.map(
          ({ config: index }) =>
            `index ${JSON.stringify([index.name, index.unique, index.columns.map((column) => ("name" in column ? column.name : dialect.sqlToQuery(column as SQL).sql)), ...(index.where ? [dialect.sqlToQuery(index.where).sql] : [])])}`,
        ),
        ...config.checks.map(
          (check) => `check ${JSON.stringify([check.name, dialect.sqlToQuery(check.value).sql])}`,
        ),
        ...spec.foreignKeys.map((key) => `foreignKey ${JSON.stringify(key)}`),
        db.insert(table).values(row).toSQL().sql,
        db.select().from(table).where(where).toSQL().sql,
        db.update(table).set(row).where(where).toSQL().sql,
        db.delete(table).where(where).toSQL().sql,
      ].join("\n"),
    ).toMatchSnapshot();
  });
}
