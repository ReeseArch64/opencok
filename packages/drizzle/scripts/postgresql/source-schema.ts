import type { Connection, RowDataPacket } from "mysql2/promise";
import { manifest } from "../../src/postgresql/manifest";
import { TransferError } from "../../src/postgresql/transfer-values";

const normalizeType = (value: string) => value.toLowerCase().replace(/\b(bigint|int|smallint|tinyint)\(\d+\)/, "$1").replaceAll(", ", ",");
function defaultValue(value: string | null, type: string) {
  if (value === null || value.toLowerCase() === "null") return null;
  if (/^(bigint|int|smallint|tinyint|float|double|decimal)/.test(type)) return value.replace(/^'(.*)'$/, "$1").replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
  return value;
}
const equal = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

export async function verifySource(source: Connection) {
  const where = "TABLE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') AND TABLE_NAME <> '__drizzle_migrations'";
  const rows = async (query: string) => (await source.query<RowDataPacket[]>(query))[0];
  const tables = await rows(`SELECT TABLE_SCHEMA,TABLE_NAME,ENGINE,TABLE_COLLATION,CAST(AUTO_INCREMENT AS CHAR) AS next_id FROM information_schema.TABLES WHERE ${where} AND TABLE_TYPE='BASE TABLE' ORDER BY TABLE_SCHEMA,TABLE_NAME`);
  tables.sort((a, b) => `${a.TABLE_SCHEMA}.${a.TABLE_NAME}` < `${b.TABLE_SCHEMA}.${b.TABLE_NAME}` ? -1 : 1);
  if (!equal(tables.map((table) => `${table.TABLE_SCHEMA}.${table.TABLE_NAME}`), manifest.tables.map((table) => table.id))) throw new TransferError("source-table-inventory");
  const columns = await rows(`SELECT * FROM information_schema.COLUMNS WHERE ${where} ORDER BY TABLE_SCHEMA,TABLE_NAME,ORDINAL_POSITION`);
  const indexes = await rows(`SELECT * FROM information_schema.STATISTICS WHERE ${where} ORDER BY TABLE_SCHEMA,TABLE_NAME,INDEX_NAME,SEQ_IN_INDEX`);
  const keys = await rows(`SELECT k.TABLE_SCHEMA,k.TABLE_NAME,k.CONSTRAINT_NAME,k.COLUMN_NAME,k.REFERENCED_TABLE_NAME,k.REFERENCED_COLUMN_NAME,r.UPDATE_RULE,r.DELETE_RULE FROM information_schema.KEY_COLUMN_USAGE k
    JOIN information_schema.REFERENTIAL_CONSTRAINTS r ON k.CONSTRAINT_SCHEMA=r.CONSTRAINT_SCHEMA AND k.CONSTRAINT_NAME=r.CONSTRAINT_NAME
    WHERE k.TABLE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY k.TABLE_SCHEMA,k.TABLE_NAME,k.CONSTRAINT_NAME,k.ORDINAL_POSITION`);
  for (const [i, table] of manifest.tables.entries()) {
    const original = tables[i]!;
    if (original.ENGINE !== table.sourceEngine || original.TABLE_COLLATION !== table.sourceCollation) throw new TransferError("source-storage-contract", table.id);
    const actual = columns.filter((column) => column.TABLE_SCHEMA === table.namespace && column.TABLE_NAME === table.name);
    if (actual.length !== table.columns.length) throw new TransferError("source-column-count", table.id);
    for (const [j, column] of table.columns.entries()) {
      const candidate = actual[j]!;
      if (!equal([candidate.COLUMN_NAME, normalizeType(candidate.COLUMN_TYPE), candidate.IS_NULLABLE === "NO",
        defaultValue(candidate.COLUMN_DEFAULT, column.sourceType), candidate.EXTRA.includes("auto_increment"), candidate.EXTRA.includes("on update"), candidate.CHARACTER_SET_NAME, candidate.COLLATION_NAME, candidate.COLUMN_COMMENT],
      [column.name, column.sourceType, column.notNull, defaultValue(column.defaultSql, column.sourceType), column.autoIncrement, column.onUpdate, column.charset, column.collation, column.comment])) throw new TransferError("source-column-contract", table.id, column.name);
    }
    const actualIndexes = indexes.filter((index) => index.TABLE_SCHEMA === table.namespace && index.TABLE_NAME === table.name).map((index) =>
      [index.INDEX_NAME, !Number(index.NON_UNIQUE), index.COLUMN_NAME, index.SUB_PART === null ? null : Number(index.SUB_PART), index.INDEX_TYPE]);
    const expectedIndexes = table.indexes.filter((index) => index.kind !== "pad-unique").sort((a, b) => a.sourceName.localeCompare(b.sourceName)).flatMap((index) => index.columns.map((column) => [index.sourceName, index.kind !== "index", column.name, column.prefix, "BTREE"]));
    // Native binary ordering and locale ordering can differ on uppercase PRIMARY.
    const sort = (values: unknown[][]) => values.map((row) => JSON.stringify(row)).sort();
    if (!equal(sort(actualIndexes), sort(expectedIndexes))) throw new TransferError("source-index-contract", table.id);
    const actualKeys = keys.filter((key) => key.TABLE_SCHEMA === table.namespace && key.TABLE_NAME === table.name).map((key) => [key.CONSTRAINT_NAME, key.COLUMN_NAME, key.REFERENCED_TABLE_NAME, key.REFERENCED_COLUMN_NAME, key.DELETE_RULE.toLowerCase(), key.UPDATE_RULE.toLowerCase()]);
    const expectedKeys = table.foreignKeys.flatMap((key) => key.columns.map((column, j) => [key.sourceName, column, key.targetTable, key.targetColumns[j], key.onDelete, key.onUpdate]));
    if (!equal(sort(actualKeys), sort(expectedKeys))) throw new TransferError("source-foreign-key-contract", table.id);
  }
  return new Map(tables.map((table) => [`${table.TABLE_SCHEMA}.${table.TABLE_NAME}`, table.next_id as string | null]));
}
