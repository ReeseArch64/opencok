import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SQL } from "drizzle-orm";
import { getTableConfig, MySqlDialect } from "drizzle-orm/mysql-core";
import type { Connection, RowDataPacket } from "mysql2/promise";
import { databaseNames, sha256 } from "../../scripts/legacy-sql";
import * as schemas from "../../src/schema";

export const catalog = databaseNames.flatMap((database) => Object.values(schemas[database])
  .map((table) => ({ database, table, config: getTableConfig(table), id: `${database}.${getTableConfig(table).name}` })))
  .sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
export type Entry = typeof catalog[number];
export const dialect = new MySqlDialect();
// Tuples keep the independent 6,316-column fixture and snapshots reviewable.
export type Column = [name: string, type: string, notNull: boolean, defaultSql: string | null, auto: boolean, onUpdate: boolean];
export type Index = [name: string, unique: boolean, columns: [string, number | null][], using: string];
export type ForeignKey = [name: string, columns: string[], target: string, targetColumns: string[], onUpdate: string, onDelete: string];
export interface TableContract { columns: Column[]; indexes: Index[]; foreignKeys: ForeignKey[] }
export interface NativeTable extends TableContract {
  engine: string; rowFormat: string; collation: string;
  columnAttributes: [name: string, charset: string | null, collation: string | null, comment: string][];
}
export interface Contract {
  version: string; migrations: Record<string, string>; tables: Record<string, NativeTable>;
}
export const normalizeType = (type: string) => type.toLowerCase()
  .replace(/\b(bigint|int|mediumint|smallint|tinyint)\(\d+\)/, "$1").replaceAll(", ", ",");

export function normalizeDefault(value: string | null, type: string): string | null {
  if (value === null || value.toLowerCase() === "null") return null;
  if (/^current_timestamp(?:\(\))?$/i.test(value)) return "current_timestamp()";
  if (/^(?:bigint|int|mediumint|smallint|tinyint|decimal|float|double)/.test(type)) {
    // Never route exact bigint/decimal defaults through Number.
    return value.replace(/^'(.*)'$/, "$1").replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  }
  return value;
}

export function runtimeContract({ config }: Entry): TableContract {
  const columns: Column[] = config.columns.map((column) => {
    const type = normalizeType(column.getSQLType());
    assert.ok(column.default === undefined || column.default instanceof SQL, "explicit SQL default contract");
    return [column.name, type, column.notNull,
      normalizeDefault(column.default === undefined ? null : dialect.sqlToQuery(column.default).sql, type),
      "autoIncrement" in column && column.autoIncrement === true,
      "hasOnUpdateNow" in column && column.hasOnUpdateNow === true];
  });
  const indexes: Index[] = [
    ...config.primaryKeys.map((key): Index => ["PRIMARY", true, key.columns.map((column) => [column.name, null]), "BTREE"]),
    ...config.indexes.map(({ config: index }): Index => [index.name, !!index.unique, index.columns.map((column): [string, number | null] => {
      if ("name" in column) return [column.name, null];
      const prefix = dialect.sqlToQuery(column).sql.match(/^`([^`]+)`\((\d+)\)$/);
      assert.ok(prefix, "recognized prefix index");
      return [prefix[1]!, Number(prefix[2])];
    }), (index.using ?? "btree").toUpperCase()]),
  ].sort((a, b) => a[0].localeCompare(b[0]));
  const action = (value?: string) => !value || value === "no action" ? "RESTRICT" : value.toUpperCase();
  const foreignKeys: ForeignKey[] = config.foreignKeys.map((key) => {
    const ref = key.reference();
    return [key.getName(), ref.columns.map((c) => c.name), getTableConfig(ref.foreignTable).name,
      ref.foreignColumns.map((c) => c.name), action(key.onUpdate), action(key.onDelete)];
  });
  return { columns, indexes, foreignKeys: foreignKeys.sort((a, b) => a[0].localeCompare(b[0])) };
}

export async function migrationHashes() {
  return Object.fromEntries(await Promise.all(databaseNames.map(async (database) => [database,
    sha256(await readFile(new URL(`../../migrations/${database}/0000_legacy.sql`, import.meta.url), "utf8"))])));
}

export async function nativeContract(connection: Connection): Promise<Contract> {
  const predicate = "TABLE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') AND TABLE_NAME <> '__drizzle_migrations'";
  const rows = async (query: string) => (await connection.query<RowDataPacket[]>(query))[0];
  const tables: Record<string, NativeTable> = {};
  for (const row of await rows(`SELECT * FROM information_schema.TABLES WHERE ${predicate} ORDER BY TABLE_SCHEMA,TABLE_NAME`)) {
    tables[`${row.TABLE_SCHEMA}.${row.TABLE_NAME}`] = { engine: row.ENGINE, rowFormat: row.ROW_FORMAT,
      collation: row.TABLE_COLLATION, columns: [], columnAttributes: [], indexes: [], foreignKeys: [] };
  }
  for (const row of await rows(`SELECT * FROM information_schema.COLUMNS WHERE ${predicate} ORDER BY TABLE_SCHEMA,TABLE_NAME,ORDINAL_POSITION`)) {
    const table = tables[`${row.TABLE_SCHEMA}.${row.TABLE_NAME}`]!;
    const type = normalizeType(row.COLUMN_TYPE);
    table.columns.push([row.COLUMN_NAME, type, row.IS_NULLABLE === "NO", normalizeDefault(row.COLUMN_DEFAULT, type),
      row.EXTRA.includes("auto_increment"), row.EXTRA.includes("on update")]);
    table.columnAttributes.push([row.COLUMN_NAME, row.CHARACTER_SET_NAME, row.COLLATION_NAME, row.COLUMN_COMMENT]);
  }
  for (const row of await rows(`SELECT * FROM information_schema.STATISTICS WHERE ${predicate} ORDER BY TABLE_SCHEMA,TABLE_NAME,INDEX_NAME,SEQ_IN_INDEX`)) {
    const table = tables[`${row.TABLE_SCHEMA}.${row.TABLE_NAME}`]!;
    let index = table.indexes.find((index) => index[0] === row.INDEX_NAME);
    if (!index) { index = [row.INDEX_NAME, !Number(row.NON_UNIQUE), [], row.INDEX_TYPE]; table.indexes.push(index); }
    index[2].push([row.COLUMN_NAME, row.SUB_PART === null ? null : Number(row.SUB_PART)]);
  }
  for (const row of await rows(`SELECT k.*, r.UPDATE_RULE, r.DELETE_RULE FROM information_schema.KEY_COLUMN_USAGE k
    JOIN information_schema.REFERENTIAL_CONSTRAINTS r ON k.CONSTRAINT_SCHEMA=r.CONSTRAINT_SCHEMA AND k.CONSTRAINT_NAME=r.CONSTRAINT_NAME
    WHERE k.TABLE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY k.TABLE_SCHEMA,k.TABLE_NAME,k.CONSTRAINT_NAME,k.ORDINAL_POSITION`)) {
    const table = tables[`${row.TABLE_SCHEMA}.${row.TABLE_NAME}`]!;
    let key = table.foreignKeys.find((key) => key[0] === row.CONSTRAINT_NAME);
    if (!key) { key = [row.CONSTRAINT_NAME, [], row.REFERENCED_TABLE_NAME, [], row.UPDATE_RULE, row.DELETE_RULE]; table.foreignKeys.push(key); }
    key[1].push(row.COLUMN_NAME); key[3].push(row.REFERENCED_COLUMN_NAME);
  }
  for (const table of Object.values(tables)) table.indexes.sort((a, b) => a[0].localeCompare(b[0]));
  return { version: "10.4.33", migrations: await migrationHashes(), tables };
}
