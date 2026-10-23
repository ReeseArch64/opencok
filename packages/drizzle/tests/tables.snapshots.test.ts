import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import fixture from "./fixtures/mariadb-contract.json";
import { catalog, runtimeContract, type Contract } from "./support/contract";
import { sampleRow } from "./support/rows";

const db = drizzle.mock();
const contract = fixture as unknown as Contract;
for (const entry of catalog) {
  test(`${entry.id}: schema and CRUD SQL`, () => {
    const row = sampleRow(contract.tables[entry.id]!);
    const column = entry.config.columns[0]!;
    const where = eq(column, row[column.name]);
    const schema = runtimeContract(entry);
    // One line per field/key avoids a deeply expanded, hard-to-review snapshot.
    expect([
      ...schema.columns.map((column) => `column ${JSON.stringify(column)}`),
      ...schema.indexes.map((index) => `index ${JSON.stringify(index)}`),
      ...schema.foreignKeys.map((key) => `foreignKey ${JSON.stringify(key)}`),
      db.insert(entry.table).values(row).toSQL().sql,
      db.select().from(entry.table).where(where).toSQL().sql,
      db.update(entry.table).set(row).where(where).toSQL().sql,
      db.delete(entry.table).where(where).toSQL().sql,
    ].join("\n")).toMatchSnapshot();
  });
}
