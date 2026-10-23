import { createConnection, type Connection, type RowDataPacket } from "mysql2/promise";
import { Pool, type PoolClient } from "pg";
import { legacyDriverOptions } from "../../src/client";
import { manifest } from "../../src/postgresql/manifest";
import { manifestHash, verifyTarget } from "../../src/postgresql/catalog";
import type { DatabaseRole, TableMapping } from "../../src/postgresql/model";
import { driverValue, RowDigest, TransferError } from "../../src/postgresql/transfer-values";
import { collationSql, ident } from "./model";
import { verifySource } from "./source-schema";

export interface TableReceipt { table: string; rows: string; digest: string; status: "copied" | "verified" }
export interface TransferOptions {
  /** This tool intentionally locks all source writes. Only an authorized restored copy is supported. */
  restoredSource: true;
  scope?: "all" | DatabaseRole;
  batchSize?: number;
  resume?: boolean;
  verifyOnly?: boolean;
  onTable?: (receipt: TableReceipt) => void | Promise<void>;
}
const mysqlIdent = (name: string) => `\`${name.replaceAll("`", "``")}\``;
const qualified = (table: TableMapping) => `${ident(table.namespace)}.${ident(table.name)}`;
const mysqlQualified = (table: TableMapping) => `${mysqlIdent(table.namespace)}.${mysqlIdent(table.name)}`;

function sourceQuery(table: TableMapping) {
  const fields = table.columns.map((column) => column.adapter === "bigint" || column.adapter === "decimal" || column.adapter === "temporal"
    ? `CAST(${mysqlIdent(column.name)} AS CHAR) AS ${mysqlIdent(column.name)}` : mysqlIdent(column.name));
  for (const [i, column] of table.columns.entries()) if (column.adapter === "text") fields.push(`HEX(WEIGHT_STRING(RTRIM(${mysqlIdent(column.name)}))) AS ${mysqlIdent(`__weight_${i}`)}`);
  const key = table.indexes.find((index) => index.kind === "primary");
  return `SELECT ${fields.join(",")} FROM ${mysqlQualified(table)} ORDER BY ${(key?.columns.map((column) => column.name) ?? table.columns.map((column) => column.name)).map(mysqlIdent).join(",")} LIMIT ? OFFSET ?`;
}

async function targetDigest(client: PoolClient, table: TableMapping, batch: number) {
  const digest = new RowDigest();
  const fields = table.columns.map((column) => ident(column.name)).join(",");
  for (let offset = 0; ; offset += batch) {
    const rows = (await client.query(`SELECT ${fields} FROM ${qualified(table)} ORDER BY ${fields} LIMIT $1 OFFSET $2`, [batch, offset])).rows;
    for (const row of rows) digest.add(row, table);
    if (rows.length < batch) return digest;
  }
}

async function validateCollations(client: PoolClient, table: TableMapping) {
  for (const column of table.columns.filter((column) => column.adapter === "text")) {
    const expression = `rtrim(raw_value,' ') COLLATE ${collationSql(column.targetCollation!)}`;
    const coarser = await client.query(`SELECT 1 FROM _legacy_weights WHERE column_name=$1 GROUP BY ${expression} HAVING count(DISTINCT source_weight)>1 LIMIT 1`, [column.name]);
    const finer = await client.query(`SELECT 1 FROM _legacy_weights WHERE column_name=$1 GROUP BY source_weight HAVING count(DISTINCT ${expression})>1 LIMIT 1`, [column.name]);
    if (coarser.rowCount || finer.rowCount) throw new TransferError("collation-equality-mismatch", table.id, column.name);
  }
}

async function synchronizeSequences(client: PoolClient, table: TableMapping, sourceNext: string | null) {
  for (const column of table.columns.filter((column) => column.autoIncrement)) {
    const maximum = (await client.query(`SELECT max(${ident(column.name)})::text AS value FROM ${qualified(table)}`)).rows[0].value;
    const next = [1n, BigInt(table.initialSequence), BigInt(sourceNext ?? "1"), maximum === null ? 1n : BigInt(maximum) + 1n].reduce((a, b) => a > b ? a : b);
    if (column.sourceType === "bigint unsigned") await client.query("UPDATE legacy_meta.unsigned_sequences SET next_value=$1 WHERE name=$2", [next.toString(), table.id]);
    else {
      const limit = column.sourceType === "bigint" ? 9223372036854775807n : column.sourceType === "int unsigned" ? 4294967295n : 2147483647n;
      const sequence = (await client.query("SELECT pg_get_serial_sequence($1,$2) AS name", [qualified(table), column.name])).rows[0].name;
      if (!sequence) throw new TransferError("missing-identity-sequence", table.id, column.name);
      await client.query("SELECT setval($1::regclass,$2::bigint,$3)", [sequence, (next > limit ? limit : next).toString(), next > limit]);
    }
  }
}

async function transferTable(source: Connection, client: PoolClient, table: TableMapping, sourceNext: string | null, options: TransferOptions): Promise<TableReceipt> {
  const textColumns = table.columns.filter((column) => column.adapter === "text").length;
  const batch = Math.min(options.batchSize ?? 128, Math.floor(50_000 / Math.max(table.columns.length, textColumns * 3, 1)));
  const columns = table.columns.map((column) => ident(column.name)).join(",");
  await client.query("BEGIN ISOLATION LEVEL REPEATABLE READ");
  try {
    // Hold target table writes until this table's data and receipt commit together.
    await client.query(`LOCK TABLE ${qualified(table)} IN EXCLUSIVE MODE`);
    const old = (await client.query("SELECT manifest_hash,row_count::text,digest FROM legacy_meta.transfer_tables WHERE table_id=$1", [table.id])).rows[0];
    if (old && !options.resume && !options.verifyOnly) throw new TransferError("resume-required", table.id);
    if (old && old.manifest_hash !== manifestHash) throw new TransferError("checkpoint-manifest-mismatch", table.id);
    if (!old && options.verifyOnly) throw new TransferError("missing-checkpoint", table.id);
    if (!old && (await client.query(`SELECT 1 FROM ${qualified(table)} LIMIT 1`)).rowCount) throw new TransferError("nonempty-untracked-target", table.id);
    await client.query("CREATE TEMP TABLE _legacy_weights (column_name text,raw_value text COLLATE \"C\",source_weight text) ON COMMIT DROP");
    const sourceDigest = new RowDigest();
    const query = sourceQuery(table);
    for (let offset = 0; ; offset += batch) {
      const [rows] = await source.query<RowDataPacket[]>(query, [batch, offset]);
      if (rows.length) {
        const values: unknown[] = [];
        const weights: unknown[] = [];
        for (const row of rows) {
          sourceDigest.add(row, table);
          for (const [i, column] of table.columns.entries()) {
            values.push(driverValue(row[column.name], column, table.id));
            if (column.adapter === "text" && row[column.name] !== null) weights.push(column.name, row[column.name], row[`__weight_${i}`]);
          }
        }
        if (!old) {
          const groups = rows.map((_, i) => `(${table.columns.map((_, j) => `$${i * table.columns.length + j + 1}`).join(",")})`);
          await client.query(`INSERT INTO ${qualified(table)} (${columns}) VALUES ${groups.join(",")}`, values);
        }
        if (weights.length) {
          const groups = Array.from({ length: weights.length / 3 }, (_, i) => `($${i * 3 + 1},$${i * 3 + 2},$${i * 3 + 3})`);
          await client.query(`INSERT INTO _legacy_weights VALUES ${groups.join(",")}`, weights);
        }
      }
      if (rows.length < batch) break;
    }
    await validateCollations(client, table);
    const target = await targetDigest(client, table, batch);
    if (target.count !== sourceDigest.count || target.result() !== sourceDigest.result()) throw new TransferError("row-or-field-reconciliation", table.id);
    if (old && (old.row_count !== sourceDigest.count.toString() || old.digest !== sourceDigest.result())) throw new TransferError("checkpoint-source-or-target-changed", table.id);
    if (!old) {
      await synchronizeSequences(client, table, sourceNext);
      await client.query("INSERT INTO legacy_meta.transfer_tables VALUES ($1,$2,$3,$4)", [table.id, manifestHash, sourceDigest.count.toString(), sourceDigest.result()]);
    }
    await client.query("COMMIT");
    return { table: table.id, rows: sourceDigest.count.toString(), digest: sourceDigest.result(), status: old ? "verified" : "copied" };
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    if (error instanceof TransferError) throw error;
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "IO_ERROR";
    throw new TransferError("table-copy-or-verify", table.id, undefined, code);
  }
}

/** Bounded-memory, table-atomic copy. Earlier table receipts make an interrupted run resumable. */
export async function transferLegacy(source: Connection, targets: Partial<Record<DatabaseRole, Pool>>, options: TransferOptions) {
  if (options.restoredSource !== true) throw new TransferError("restored-source-required");
  if (options.scope && !["global", "realm", "all"].includes(options.scope)) throw new TransferError("invalid-scope");
  if (!Number.isInteger(options.batchSize ?? 128) || (options.batchSize ?? 128) < 1 || (options.batchSize ?? 128) > 1000) throw new TransferError("invalid-batch-size");
  const roles: DatabaseRole[] = options.scope === "global" ? ["global"] : options.scope === "realm" ? ["realm"] : ["global", "realm"];
  const clients = new Map<DatabaseRole, PoolClient>();
  let locked = false;
  try {
    for (const role of roles) {
      if (!targets[role]) throw new TransferError("missing-target", role);
      const client = await targets[role]!.connect(); clients.set(role, client);
      if (!(await client.query("SELECT pg_try_advisory_lock(1936028531,17) AS locked")).rows[0].locked) throw new TransferError("target-transfer-already-running", role);
      await verifyTarget(client, role);
    }
    const [scheduler] = await source.query<RowDataPacket[]>("SHOW VARIABLES LIKE 'event_scheduler'");
    if (scheduler[0]?.Value === "ON") throw new TransferError("source-event-scheduler-must-be-off");
    // Covers MyISAM as well as InnoDB. The dedicated source connection must stay alive.
    await source.query("FLUSH TABLES WITH READ LOCK"); locked = true;
    const nextIds = await verifySource(source);
    const receipts: TableReceipt[] = [];
    for (const table of manifest.tables.filter((table) => roles.includes(table.role))) {
      const receipt = await transferTable(source, clients.get(table.role)!, table, nextIds.get(table.id) ?? null, options);
      receipts.push(receipt); await options.onTable?.(receipt);
    }
    // Detect catalog tampering while a run was in progress too.
    for (const [role, client] of clients) await verifyTarget(client, role);
    return receipts;
  } catch (error) {
    if (error instanceof TransferError) throw error;
    throw new TransferError("preflight-or-run", "catalog", undefined, error && typeof error === "object" && "code" in error ? String(error.code) : "IO_ERROR");
  } finally {
    if (locked) await source.query("UNLOCK TABLES").catch(() => undefined);
    for (const client of clients.values()) {
      try { await client.query("SELECT pg_advisory_unlock(1936028531,17)"); }
      finally { client.release(); }
    }
  }
}

if (import.meta.main) {
  let source: Connection | undefined;
  const targets: Partial<Record<DatabaseRole, Pool>> = {};
  try {
    if (!process.argv.includes("--restored-source") || !process.env.MIGRATION_SOURCE_URL) throw new TransferError("restored-source-and-url-required");
    const scopeIndex = process.argv.indexOf("--scope");
    const scope = scopeIndex < 0 ? "all" : process.argv[scopeIndex + 1];
    if (!["all", "global", "realm"].includes(scope ?? "")) throw new TransferError("invalid-scope");
    for (const role of ["global", "realm"] as DatabaseRole[]) if (scope === "all" || scope === role) {
      const url = process.env[role === "global" ? "PG_GLOBAL_URL" : "PG_REALM_URL"];
      if (!url) throw new TransferError("missing-target-url", role);
      targets[role] = new Pool({ connectionString: url, options: "-c timezone=UTC" });
    }
    source = await createConnection({ uri: process.env.MIGRATION_SOURCE_URL, ...legacyDriverOptions, charset: "utf8mb4" });
    const receipts = await transferLegacy(source, targets, { restoredSource: true, scope: scope as "all" | DatabaseRole,
      resume: process.argv.includes("--resume"), verifyOnly: process.argv.includes("--verify-only"),
      onTable: (receipt) => { console.log(`${receipt.status}: ${receipt.table} (${receipt.rows} rows)`); } });
    console.log(`Reconciled ${receipts.length} tables`);
  } catch (error) {
    console.error(error instanceof TransferError ? error.message : "Legacy transfer failed; inspect the isolated setup without logging raw driver errors");
    process.exitCode = 1;
  } finally {
    await source?.end();
    await Promise.all(Object.values(targets).map((pool) => pool.end()));
  }
}
