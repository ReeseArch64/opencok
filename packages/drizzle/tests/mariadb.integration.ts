import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { eq, sql } from "drizzle-orm";
import { getTableConfig, MySqlDialect } from "drizzle-orm/mysql-core";
import { createConnection, type Connection, type RowDataPacket } from "mysql2/promise";
import { bootstrap } from "../scripts/bootstrap";
import { generate } from "../scripts/generate";
import { databaseNames, inputNames, quoteIdentifier, sha256 } from "../scripts/legacy-sql";
import { createLegacyDatabase, legacyDriverOptions } from "../src/client";
import * as schemas from "../src/schema";

const directory = process.env.LEGACY_SQL_DIR;
if (!directory) throw new Error("Set LEGACY_SQL_DIR; parity requires the authorized local SQL inputs");
const root = join(import.meta.dir, "..");
const image = "mariadb:10.4.33";
const runId = randomBytes(6).toString("hex");
const password = randomBytes(24).toString("hex");
const containers = [`opencok-drizzle-reference-${runId}`, `opencok-drizzle-baseline-${runId}`];
const connections: Connection[] = [];

async function docker(args: string[], input?: string): Promise<string> {
  const child = Bun.spawn(["docker", ...args], {
    env: { ...process.env, MYSQL_ROOT_PASSWORD: password },
    stdin: input === undefined ? "ignore" : new Blob([input]), stdout: "pipe", stderr: "pipe",
  });
  const [output, , code] = await Promise.all([new Response(child.stdout).text(), new Response(child.stderr).text(), child.exited]);
  // Client errors may print private SQL; do not propagate raw container output.
  if (code) throw new Error(`Disposable MariaDB command failed (${args[0]}, exit ${code})`);
  return output.trim();
}

async function start(name: string) {
  await docker(["run", "--detach", "--rm", "--name", name, "--env", "MYSQL_ROOT_PASSWORD", "--publish", "127.0.0.1::3306", image, "--event-scheduler=OFF"]);
  const binding = await docker(["port", name, "3306/tcp"]);
  const options = { host: "127.0.0.1", port: Number(binding.split(":").at(-1)), user: "root", password, charset: "utf8mb4" };
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const connection = await createConnection({ ...options, ...legacyDriverOptions });
      connections.push(connection);
      return { connection, options };
    } catch {
      await Bun.sleep(500);
    }
  }
  throw new Error("Disposable MariaDB startup timed out");
}

async function rows(connection: Connection, query: string) {
  return (await connection.query<RowDataPacket[]>(query))[0];
}

function same(label: string, actual: unknown, expected: unknown) {
  // Compare private seed/program contents without embedding them in assertion output.
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const fields = Array.isArray(actual) && Array.isArray(expected)
      ? [...new Set(actual.flatMap((row, i) => Object.keys(row).filter((key) => JSON.stringify(row[key]) !== JSON.stringify(expected[i]?.[key]))))].join(", ") : "";
    throw new Error(`Parity mismatch: ${label}${fields ? ` (${fields})` : ""}`);
  }
}

const predicate = `TABLE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') AND TABLE_NAME <> '__drizzle_migrations'`;

try {
  assert.equal(await generate(directory, root, true), 772);
  console.log("Verified deterministic generation and source hashes");
  const reference = await start(containers[0]!);
  const baseline = await start(containers[1]!);
  for (const database of databaseNames) {
    const charset = database === "opencok_chat" ? "utf8mb4 COLLATE utf8mb4_unicode_ci" : "utf8 COLLATE utf8_general_ci";
    await reference.connection.query(`CREATE DATABASE ${quoteIdentifier(database)} CHARACTER SET ${charset}`);
  }
  // Independent oracle: MariaDB's own CLI reads the original dumps, including
  // DELIMITER directives. It does not use our parser or generated schema.
  for (const input of inputNames) {
    const database = databaseNames.find((db) => input === `${db}.sql`);
    const content = (await readFile(join(directory, input), "utf8")).replaceAll("ROW_FORMAT=COMPACT", "ROW_FORMAT=DYNAMIC");
    // Both paths use TCP so implicit routine definers select the same account.
    await docker(["exec", "-i", containers[0]!, "sh", "-c", 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysql -uroot --host="$HOSTNAME" --protocol=TCP --default-character-set=utf8mb4 "$@"', "sh", ...(database ? [database] : [])], content);
  }
  await bootstrap(baseline.connection, directory);
  console.log("Initialized original SQL and Drizzle baseline in separate disposable instances");

  const tables = await rows(reference.connection, `SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.TABLES WHERE ${predicate} ORDER BY TABLE_SCHEMA, TABLE_NAME`);
  assert.equal(tables.length, 772);
  const metadata = {
    databases: "SELECT SCHEMA_NAME, DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY SCHEMA_NAME",
    tables: `SELECT TABLE_SCHEMA, TABLE_NAME, ENGINE, ROW_FORMAT, TABLE_COLLATION, AUTO_INCREMENT, CREATE_OPTIONS, TABLE_COMMENT FROM information_schema.TABLES WHERE ${predicate} ORDER BY TABLE_SCHEMA, TABLE_NAME`,
    columns: `SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, ORDINAL_POSITION, COLUMN_DEFAULT, IS_NULLABLE, COLUMN_TYPE, CHARACTER_SET_NAME, COLLATION_NAME, COLUMN_KEY, EXTRA, COLUMN_COMMENT FROM information_schema.COLUMNS WHERE ${predicate} ORDER BY TABLE_SCHEMA, TABLE_NAME, ORDINAL_POSITION`,
    indexes: `SELECT TABLE_SCHEMA, TABLE_NAME, INDEX_NAME, NON_UNIQUE, SEQ_IN_INDEX, COLUMN_NAME, COLLATION, SUB_PART, INDEX_TYPE FROM information_schema.STATISTICS WHERE ${predicate} ORDER BY TABLE_SCHEMA, TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`,
    foreignKeys: `SELECT CONSTRAINT_SCHEMA, CONSTRAINT_NAME, TABLE_NAME, REFERENCED_TABLE_NAME, UPDATE_RULE, DELETE_RULE FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY CONSTRAINT_SCHEMA, CONSTRAINT_NAME`,
    triggers: "SELECT TRIGGER_SCHEMA, TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, ACTION_TIMING, SHA2(ACTION_STATEMENT,256) AS body, SQL_MODE, DEFINER, CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION FROM information_schema.TRIGGERS ORDER BY TRIGGER_SCHEMA, TRIGGER_NAME",
    routines: "SELECT ROUTINE_SCHEMA, ROUTINE_NAME, ROUTINE_TYPE, DTD_IDENTIFIER, SHA2(ROUTINE_DEFINITION,256) AS body, IS_DETERMINISTIC, SQL_DATA_ACCESS, SECURITY_TYPE, SQL_MODE, DEFINER, CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') ORDER BY ROUTINE_SCHEMA, ROUTINE_NAME",
    events: "SELECT EVENT_SCHEMA, EVENT_NAME, SHA2(EVENT_DEFINITION,256) AS body, EVENT_TYPE, INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ON_COMPLETION, SQL_MODE, DEFINER, TIME_ZONE, CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION FROM information_schema.EVENTS ORDER BY EVENT_SCHEMA, EVENT_NAME",
  };
  for (const [label, query] of Object.entries(metadata)) {
    const expected = await rows(reference.connection, query);
    const actual = await rows(baseline.connection, query);
    same(label, actual, expected);
    console.log(`Parity: ${label} (${actual.length})`);
  }
  for (const table of tables) {
    const name = `${quoteIdentifier(table.TABLE_SCHEMA)}.${quoteIdentifier(table.TABLE_NAME)}`;
    same(`SHOW CREATE TABLE ${name}`, await rows(baseline.connection, `SHOW CREATE TABLE ${name}`), await rows(reference.connection, `SHOW CREATE TABLE ${name}`));
    same(`seed checksum ${name}`, await rows(baseline.connection, `CHECKSUM TABLE ${name} EXTENDED`), await rows(reference.connection, `CHECKSUM TABLE ${name} EXTENDED`));
  }
  console.log("Parity: all 772 CREATE TABLE definitions and seed checksums");

  // Check that the runtime Drizzle definitions really cover the reference,
  // independently of the schema-only migrations used to create the baseline.
  const dialect = new MySqlDialect();
  let totalColumns = 0;
  for (const database of databaseNames) {
    same(`${database} Drizzle table inventory`, Object.values(schemas[database]).map((table) => getTableConfig(table).name).sort(), tables.filter((table) => table.TABLE_SCHEMA === database).map((table) => table.TABLE_NAME).sort());
    const databaseColumns = await rows(reference.connection, `SELECT TABLE_NAME, COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='${database}' ORDER BY TABLE_NAME, ORDINAL_POSITION`);
    const databaseIndexes = await rows(reference.connection, `SELECT TABLE_NAME, INDEX_NAME, NON_UNIQUE, SEQ_IN_INDEX, COLUMN_NAME, SUB_PART, INDEX_TYPE FROM information_schema.STATISTICS WHERE TABLE_SCHEMA='${database}' ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX`);
    const databaseForeignKeys = await rows(reference.connection, `SELECT k.TABLE_NAME, k.CONSTRAINT_NAME, k.COLUMN_NAME, k.REFERENCED_TABLE_NAME, k.REFERENCED_COLUMN_NAME, r.UPDATE_RULE, r.DELETE_RULE FROM information_schema.KEY_COLUMN_USAGE k JOIN information_schema.REFERENTIAL_CONSTRAINTS r ON k.CONSTRAINT_SCHEMA=r.CONSTRAINT_SCHEMA AND k.CONSTRAINT_NAME=r.CONSTRAINT_NAME WHERE k.TABLE_SCHEMA='${database}' ORDER BY k.TABLE_NAME, k.CONSTRAINT_NAME, k.ORDINAL_POSITION`);
    for (const table of Object.values(schemas[database])) {
      const config = getTableConfig(table);
      const expected = databaseColumns.filter((column) => column.TABLE_NAME === config.name);
      assert.equal(config.columns.length, expected.length, `${database}.${config.name} column count`);
      const normalizeType = (type: string) => type.toLowerCase().replace(/\b(bigint|int|smallint|tinyint)\(\d+\)/, "$1").replaceAll(", ", ",");
      for (const [i, column] of config.columns.entries()) {
        const original = expected[i]!;
        assert.equal(column.name, original.COLUMN_NAME);
        assert.equal(normalizeType(column.getSQLType()), normalizeType(original.COLUMN_TYPE), `${database}.${config.name}.${column.name} type`);
        assert.equal(column.notNull, original.IS_NULLABLE === "NO");
        assert.equal("autoIncrement" in column && column.autoIncrement === true, original.EXTRA.includes("auto_increment"));
        assert.equal("hasOnUpdateNow" in column && column.hasOnUpdateNow === true, original.EXTRA.includes("on update"));
        const declaredDefault = column.default === undefined ? null : dialect.sqlToQuery(column.default as ReturnType<typeof sql.raw>).sql;
        // MariaDB canonicalizes numeric quoted literals and NULL; ask it to compare
        // expressions rather than converting 64-bit defaults through JS Number.
        const actualDefault = declaredDefault?.toLowerCase() === "null" ? null : declaredDefault;
        const expectedDefault = original.COLUMN_DEFAULT === "NULL" ? null : original.COLUMN_DEFAULT;
        if (actualDefault !== expectedDefault) {
          assert.ok(actualDefault !== null && expectedDefault !== null, `${config.name}.${column.name} default presence`);
          const result = await rows(reference.connection, `SELECT (${actualDefault}) <=> (${expectedDefault}) AS equal_default`);
          assert.equal(result[0]!.equal_default, 1, `${config.name}.${column.name} default`);
        }
      }
      const originalIndexes = databaseIndexes.filter((index) => index.TABLE_NAME === config.name);
      const indexOrder = (a: { INDEX_NAME: string; SEQ_IN_INDEX: number }, b: { INDEX_NAME: string; SEQ_IN_INDEX: number }) => a.INDEX_NAME < b.INDEX_NAME ? -1 : a.INDEX_NAME > b.INDEX_NAME ? 1 : a.SEQ_IN_INDEX - b.SEQ_IN_INDEX;
      const runtimeIndexes = [
        ...config.primaryKeys.flatMap((key) => key.columns.map((column, i) => ({ INDEX_NAME: "PRIMARY", NON_UNIQUE: 0, SEQ_IN_INDEX: i + 1, COLUMN_NAME: column.name, SUB_PART: null as number | null, INDEX_TYPE: "BTREE" }))),
        ...config.indexes.flatMap(({ config: index }) => index.columns.map((column, i) => {
          const prefix = "name" in column ? undefined : dialect.sqlToQuery(column).sql.match(/^`([^`]+)`\((\d+)\)$/);
          assert.ok("name" in column || prefix, "supported runtime index expression");
          return { INDEX_NAME: index.name, NON_UNIQUE: index.unique ? 0 : 1, SEQ_IN_INDEX: i + 1, COLUMN_NAME: "name" in column ? column.name : prefix![1], SUB_PART: prefix ? Number(prefix[2]) : null, INDEX_TYPE: (index.using ?? "btree").toUpperCase() };
        })),
      ].sort(indexOrder);
      same(`${database}.${config.name} Drizzle indexes`, runtimeIndexes, originalIndexes.map((index) => ({ INDEX_NAME: String(index.INDEX_NAME), NON_UNIQUE: Number(index.NON_UNIQUE), SEQ_IN_INDEX: Number(index.SEQ_IN_INDEX), COLUMN_NAME: index.COLUMN_NAME, SUB_PART: index.SUB_PART === null ? null : Number(index.SUB_PART), INDEX_TYPE: index.INDEX_TYPE })).sort(indexOrder));
      const originalForeignKeys = databaseForeignKeys.filter((key) => key.TABLE_NAME === config.name).map(({ TABLE_NAME: _tableName, ...key }) => key);
      const action = (value: string | undefined) => !value || value === "no action" ? "RESTRICT" : value.toUpperCase();
      const runtimeForeignKeys = config.foreignKeys.flatMap((key) => {
        const reference = key.reference();
        return reference.columns.map((column, i) => ({ CONSTRAINT_NAME: key.getName(), COLUMN_NAME: column.name, REFERENCED_TABLE_NAME: getTableConfig(reference.foreignTable).name, REFERENCED_COLUMN_NAME: reference.foreignColumns[i]!.name, UPDATE_RULE: action(key.onUpdate), DELETE_RULE: action(key.onDelete) }));
      }).sort((a, b) => a.CONSTRAINT_NAME.localeCompare(b.CONSTRAINT_NAME));
      same(`${database}.${config.name} Drizzle foreign keys`, runtimeForeignKeys, originalForeignKeys);
      totalColumns += config.columns.length;
    }
  }
  console.log(`Drizzle runtime parity: ${totalColumns} columns, all indexes and foreign keys`);

  const chat = createLegacyDatabase("opencok_chat", baseline.options);
  const pay = createLegacyDatabase("cokdb_pay", baseline.options);
  const game = createLegacyDatabase("cokdb1", baseline.options);
  const bytes = Buffer.from([0, 255, 128, 39, 92, 0]);
  try {
    const message = { sequence_id: 18446744073709551614n, room_key: "synthetic-room", sender_uid: "synthetic-player", idempotency_key: bytes, body: "synthetic 🐉", created_at: "2026-10-23 12:34:56.789", expires_at: "2026-10-30 12:34:56.789" };
    await chat.db.insert(schemas.opencok_chat.chat_message).values(message);
    assert.deepEqual((await chat.db.select().from(schemas.opencok_chat.chat_message))[0], message);
    await assert.rejects(async () => { await chat.db.insert(schemas.opencok_chat.chat_message).values({ ...message, sequence_id: 2n }); });
    await pay.db.insert(schemas.cokdb_pay.exchange).values({ name: "synthetic-exchange", paidGold: 9223372036854775807n, price: "99999999.99" });
    const [exchange] = await pay.db.select().from(schemas.cokdb_pay.exchange).where(eq(schemas.cokdb_pay.exchange.name, "synthetic-exchange"));
    assert.equal(exchange?.paidGold, 9223372036854775807n);
    assert.equal(exchange?.price, "99999999.99");
    await pay.db.insert(schemas.cokdb_pay.logs_packages).values({ uid: "synthetic-zero-date" });
    assert.equal((await pay.db.select().from(schemas.cokdb_pay.logs_packages).where(eq(schemas.cokdb_pay.logs_packages.uid, "synthetic-zero-date")))[0]?.time, "0000-00-00 00:00:00");
    await game.db.insert(schemas.cokdb1.alliance_diplomacy).values({ uid: "synthetic-alliance", ally: bytes });
    assert.deepEqual((await game.db.select().from(schemas.cokdb1.alliance_diplomacy).where(eq(schemas.cokdb1.alliance_diplomacy.uid, "synthetic-alliance")))[0]?.ally, bytes);
    await assert.rejects(chat.db.transaction(async (tx) => {
      await tx.delete(schemas.opencok_chat.chat_message);
      throw new Error("synthetic rollback");
    }));
    assert.equal((await chat.db.select().from(schemas.opencok_chat.chat_message)).length, 1);
    await assert.rejects(bootstrap(baseline.connection, directory), /requires all four/);
    console.log("Round trips: unsigned/signed bigint, decimal, binary, blob, emoji, fractional and zero dates, unique constraint and transaction rollback");
  } finally {
    await Promise.all([chat.close(), pay.close(), game.close()]);
  }
  for (const connection of connections) await connection.end();
  connections.length = 0;
  await docker(["restart", containers[1]!]);
  // Docker can reassign a dynamically published host port on restart.
  baseline.options.port = Number((await docker(["port", containers[1]!, "3306/tcp"])).split(":").at(-1));
  let reconnected = false;
  let reconnectFailure = "not attempted";
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const reopened = createLegacyDatabase("opencok_chat", baseline.options);
      try {
        assert.equal((await reopened.db.select().from(schemas.opencok_chat.chat_message))[0]?.sequence_id, 18446744073709551614n);
        reconnected = true;
        break;
      } finally { await reopened.close(); }
    } catch (error) {
      const cause = error instanceof Error && error.cause ? error.cause : error;
      reconnectFailure = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : "unknown";
      await Bun.sleep(500);
    }
  }
  assert.ok(reconnected, `synthetic state survives MariaDB restart (${reconnectFailure})`);
  const inventory = JSON.parse(await readFile(join(root, "inventory.json"), "utf8"));
  for (const input of inventory.inputs) assert.equal(sha256(await readFile(join(directory, input.name), "utf8")), input.sha256);
  console.log("PASS: restart persistence, source preservation and full MariaDB baseline parity");
} catch (error) {
  console.error(error && typeof error === "object" && "code" in error && error.code !== "ERR_ASSERTION" ? `MariaDB validation failed (${error.code})` : error instanceof Error ? error.message : "Validation failed");
  process.exitCode = 1;
} finally {
  for (const connection of connections) await connection.end().catch(() => {});
  for (const name of containers) await docker(["rm", "--force", "--volumes", name]).catch(() => {});
}
