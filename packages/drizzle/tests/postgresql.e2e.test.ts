import { afterAll, beforeAll, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { bootstrapPostgres } from "../scripts/postgresql/bootstrap";
import { createPostgresDatabase } from "../src/postgresql/client";
import { legacyTextEquals } from "../src/postgresql/comparison";
import { chat_message } from "../src/postgresql/schema/opencok_chat";
import { logging_event, logging_event_property, user_tasks } from "../src/postgresql/schema/cokdb_global";
import { exchange } from "../src/postgresql/schema/cokdb_pay";
import artifact from "./fixtures/mariadb-contract.json";
import type { Contract } from "./support/contract";
import { pgCatalog } from "./support/pg-catalog";
import { DisposablePostgres } from "./support/postgres";
import { literalDefault, sampleRow, type Row } from "./support/rows";

const source = artifact as unknown as Contract;
const server = new DisposablePostgres();
const clients = new Map<string, { db: NodePgDatabase; pool: Pool; close: () => Promise<void> }>();
const metadata = new Map<string, unknown[]>();
const completed = new Set<string>();
const normalizeIndex = (value: string) => value.replace(/COLLATE\s+(?:"?\w+"?\.)?"?\w+"?/gi, "")
  .replace(/::(?:text|character varying)/g, "").replace(/\b(?:from|for)\b/gi, ",").replace(/\bSUBSTRING\b/g, "substring").replace(/[\s"()]/g, "");
async function closeClients() { await Promise.all([...clients.values()].map((client) => client.close())); clients.clear(); }
function openClients() {
  for (const role of ["global", "realm"] as const) clients.set(role, createPostgresDatabase(role, { ...server.options, database: role }));
}
async function rejectsCode(action: PromiseLike<unknown>, code: string) {
  try { await action; } catch (error) {
    const cause = error instanceof Error && error.cause ? error.cause : error;
    assert.ok(cause && typeof cause === "object" && "code" in cause);
    expect(cause.code).toBe(code); return;
  }
  throw new Error(`Expected PostgreSQL error ${code}`);
}

beforeAll(async () => {
  const admin = await server.start();
  try { for (const role of ["global", "realm"]) await admin.query(`CREATE DATABASE "${role}"`); }
  finally { await admin.end(); }
  openClients();
  for (const [role, { pool }] of clients) {
    const connection = await pool.connect();
    try {
      await bootstrapPostgres(connection, role as "global" | "realm");
      const native = await connection.query(`SELECT n.nspname,c.relname,a.attname,format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull,co.collname
        FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace LEFT JOIN pg_collation co ON co.oid=a.attcollation
        WHERE n.nspname IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') AND c.relkind='r' AND a.attnum>0 AND NOT a.attisdropped ORDER BY n.nspname,c.relname,a.attnum`);
      for (const row of native.rows) {
        const id = `${row.nspname}.${row.relname}`;
        metadata.set(id, [...(metadata.get(id) ?? []), [row.attname, row.type.replaceAll(", ", ","), row.attnotnull, row.collname]]);
      }
    } finally { connection.release(); }
  }
  expect([...metadata.keys()].sort()).toEqual(pgCatalog.map(({ mapping }) => mapping.id));
  expect([...metadata.values()].reduce((n, columns) => n + columns.length, 0)).toBe(6316);
}, 120_000);
afterAll(async () => { try { await closeClients(); } finally { await server.stop(); } }, 30_000);

for (const { mapping, table, config } of pgCatalog) {
  test(`${mapping.id}: PostgreSQL catalog, all-field CRUD, defaults, constraints and rollback`, async () => {
    const { db, pool } = clients.get(mapping.role)!;
    const native = source.tables[mapping.id]!;
    expect(metadata.get(mapping.id)).toEqual(mapping.columns.map((column) => [column.name, column.targetType, column.notNull,
      column.targetCollation ? column.targetCollation === "C" ? "C" : column.targetCollation.split(".")[1] : column.targetType === "text" ? "default" : null]));
    const indexes = (await pool.query("SELECT indexname FROM pg_indexes WHERE schemaname=$1 AND tablename=$2 ORDER BY indexname COLLATE \"C\"", [mapping.namespace, mapping.name])).rows.map((row) => row.indexname);
    expect(indexes).toEqual(mapping.indexes.map((index) => index.targetName).sort());
    const nativeIndexes = (await pool.query(`SELECT idx.relname AS name, i.indisunique,
      ARRAY(SELECT pg_get_indexdef(i.indexrelid,position,true) FROM generate_series(1,i.indnkeyatts) position) AS expressions
      FROM pg_index i JOIN pg_class idx ON idx.oid=i.indexrelid JOIN pg_class t ON t.oid=i.indrelid JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname=$1 AND t.relname=$2`, [mapping.namespace, mapping.name])).rows;
    for (const index of mapping.indexes) {
      const actual = nativeIndexes.find((candidate) => candidate.name === index.targetName)!;
      expect(actual.indisunique).toBe(index.kind !== "index");
      expect(actual.expressions.map(normalizeIndex)).toEqual(index.expressions.map(normalizeIndex));
    }
    const keys = (await pool.query(`SELECT con.conname,con.contype,con.confupdtype,con.confdeltype,
      ARRAY(SELECT a.attname::text FROM unnest(con.conkey) WITH ORDINALITY AS cols(num,ord) JOIN pg_attribute a ON a.attrelid=con.conrelid AND a.attnum=cols.num ORDER BY cols.ord) AS columns
      FROM pg_constraint con JOIN pg_class c ON c.oid=con.conrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname=$1 AND c.relname=$2`, [mapping.namespace, mapping.name])).rows;
    expect(keys.filter((key) => key.contype === "p").map((key) => key.columns)).toEqual(native.indexes.filter((key) => key[0] === "PRIMARY").map((key) => key[2].map((column) => column[0])));
    for (const key of mapping.foreignKeys) {
      const actual = keys.find((candidate) => candidate.conname === key.targetName)!;
      expect(actual.columns).toEqual(key.columns);
      expect(actual.confupdtype).toBe(key.onUpdate === "cascade" ? "c" : "r");
      expect(actual.confdeltype).toBe(key.onDelete === "cascade" ? "c" : "r");
    }
    expect(keys.filter((key) => key.contype === "c")).toHaveLength(mapping.columns.reduce((n, column) => n + column.checks.length, 0));
    const original = sampleRow(native), changed = sampleRow(native, 2);
    const read = () => db.select().from(table);
    expect(await read()).toHaveLength(0);
    await db.insert(table).values(original); expect(await read()).toEqual([original]);
    await db.update(table).set(changed); expect(await read()).toEqual([changed]);
    await db.delete(table); expect(await read()).toEqual([]);
    const required: Row = {};
    for (const [name, , notNull, defaultSql, auto] of native.columns) if (notNull && defaultSql === null && !auto) required[name] = original[name];
    const now = async () => (await pool.query("SELECT legacy_meta.utc_now(0) AS now")).rows[0].now as string;
    const before = await now();
    await db.insert(table).values(required);
    const defaults = await read(); expect(defaults).toHaveLength(1);
    const after = await now(), actual = defaults[0]! as Row;
    for (const column of native.columns) {
      const [name, , , value, auto] = column;
      if (name in required) expect(actual[name]).toEqual(required[name]);
      else if (auto) expect(BigInt(actual[name] as number | string | bigint)).toBeGreaterThan(0n);
      else if (value === "current_timestamp()") assert.ok(String(actual[name]) >= before && String(actual[name]) <= after);
      else expect(actual[name]).toEqual(literalDefault(column));
    }
    await db.delete(table); await db.insert(table).values(original);
    const nullable = { ...original };
    for (const [name, , notNull] of native.columns) if (!notNull) nullable[name] = null;
    await db.update(table).set(nullable); expect(await read()).toEqual([nullable]);
    await db.update(table).set(original);
    for (const [name, type, notNull] of native.columns) {
      if (!notNull) continue;
      if (type.startsWith("timestamp")) {
        const start = await now(); await db.update(table).set({ [name]: null });
        const [row] = await read(); assert.ok(String((row as Row)[name]) >= start && String((row as Row)[name]) <= await now());
        await db.update(table).set(original);
      } else await rejectsCode(db.update(table).set({ [name]: null }), "23502");
    }
    for (const index of mapping.indexes.filter((index) => index.kind !== "index" && index.kind !== "pad-unique")) {
      const duplicate = { ...changed };
      for (const column of index.columns) duplicate[column.name] = original[column.name];
      await rejectsCode(db.insert(table).values(duplicate), "23505");
    }
    for (const key of mapping.foreignKeys) await rejectsCode(db.update(table).set(Object.fromEntries(key.columns.map((column) => [column, 999n]))), "23503");
    for (const column of mapping.columns) {
      if (column.adapter === "temporal") await rejectsCode(db.update(table).set({ [column.name]: "invalid-date" }), "23514");
      if (column.sourceType === "tinyint") await rejectsCode(db.update(table).set({ [column.name]: -129 }), "23514");
      if (column.sourceType === "int unsigned") await rejectsCode(db.update(table).set({ [column.name]: -1 }), "23514");
    }
    const abort = new Error("synthetic rollback");
    await expect(db.transaction(async (tx) => { await tx.update(table).set(changed); throw abort; })).rejects.toBe(abort);
    expect(await read()).toEqual([original]);
    for (const [name, , , , , onUpdate] of native.columns) if (onUpdate) {
      const column = config.columns.find((column) => column.name !== name)!;
      const start = await now();
      await db.update(table).set({ [column.name]: changed[column.name] });
      const [row] = await read(); assert.ok(String((row as Row)[name]) >= start && String((row as Row)[name]) <= await now());
      await db.update(table).set(original);
    }
    expect(await read()).toEqual([original]); completed.add(mapping.id);
  }, 15_000);
}

test("PostgreSQL exact numeric limits, binary and Unicode round trips", async () => {
  const chat = clients.get("global")!.db;
  const original = sampleRow(source.tables["opencok_chat.chat_message"]!);
  const pay = sampleRow(source.tables["cokdb_pay.exchange"]!);
  try {
    const edge = { sequence_id: 18446744073709551615n, body: "synthetic 🐉", idempotency_key: Buffer.from([0, 255, 128, 39, 92, 0]) };
    await chat.update(chat_message).set(edge);
    assert.deepEqual(await chat.select().from(chat_message), [{ ...original, ...edge }]);
    await chat.update(exchange).set({ paidGold: 9223372036854775807n, price: "99999999.99" });
    expect((await chat.select().from(exchange))[0]!.paidGold).toBe(9223372036854775807n);
    expect((await chat.select().from(exchange))[0]!.price).toBe("99999999.99");
    await chat.update(exchange).set({ paidGold: -9223372036854775808n });
    expect((await chat.select().from(exchange))[0]!.paidGold).toBe(-9223372036854775808n);
    await expect((async () => { await chat.update(chat_message).set({ sequence_id: 18446744073709551616n }); })()).rejects.toThrow("Unsigned bigint outside source range");
  } finally { await chat.update(chat_message).set(original); await chat.update(exchange).set(pay); }
});

test("PostgreSQL preserves FK RESTRICT/CASCADE actions and PAD SPACE key semantics", async () => {
  const db = clients.get("global")!.db;
  await rejectsCode(db.delete(logging_event), "23503");
  await rejectsCode(db.update(logging_event).set({ event_id: 777n }), "23503");
  const parent = sampleRow(source.tables["cokdb_global.logging_event"]!);
  const child = sampleRow(source.tables["cokdb_global.user_tasks"]!, 2);
  const parentTable = pgCatalog.find(({ mapping }) => mapping.id === "cokdb_global.logging_event")!.table;
  const childTable = pgCatalog.find(({ mapping }) => mapping.id === "cokdb_global.user_tasks")!.table;
  await db.insert(parentTable).values({ ...parent, event_id: 777n });
  await db.insert(childTable).values({ ...child, event_id: 777n });
  await db.update(logging_event).set({ event_id: 778n }).where(eq(logging_event.event_id, 777n));
  expect(await db.select().from(user_tasks).where(eq(user_tasks.event_id, 778n))).toHaveLength(1);
  await db.delete(logging_event).where(eq(logging_event.event_id, 778n));
  expect(await db.select().from(user_tasks)).toHaveLength(1);
  expect(await db.select().from(logging_event_property)).toHaveLength(1);
  const row = (await db.select().from(exchange))[0]!;
  expect(await db.select().from(exchange).where(legacyTextEquals(exchange.name, `${row.name} `))).toHaveLength(1);
});

test("all PostgreSQL tables and 6,316 retained fields survive restart", async () => {
  expect([...completed].sort()).toEqual(pgCatalog.map(({ mapping }) => mapping.id));
  await closeClients(); await server.restart(); openClients();
  for (const { mapping, table } of pgCatalog) assert.deepEqual(await clients.get(mapping.role)!.db.select().from(table), [sampleRow(source.tables[mapping.id]!)], `${mapping.id} restart persistence`);
}, 120_000);
