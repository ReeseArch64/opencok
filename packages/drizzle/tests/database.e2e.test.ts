import { afterAll, beforeAll, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";
import { createDatabase, type DatabaseRole } from "../src";
import { migrateDatabase } from "../scripts/migrate";
import { exchange } from "../src/schema/cokdb_pay";
import { chat_message } from "../src/schema/opencok_chat";
import { logging_event, logging_event_property, user_tasks } from "../src/schema/cokdb_global";
import { catalog, normalizeType } from "./support/schema";
import { sampleRow, literalDefault, type Row } from "./support/rows";
import { DisposablePostgres } from "./support/postgres";

const server = new DisposablePostgres();
const clients = new Map<DatabaseRole, { db: NodePgDatabase; pool: Pool; close: () => Promise<void> }>();
const completed = new Set<string>();
function openClients() {
  for (const role of ["global", "realm"] as const) {
    const client = createDatabase(role, { ...server.options, database: role });
    clients.set(role, { ...client, db: client.db as unknown as NodePgDatabase });
  }
}
async function closeClients() { await Promise.all([...clients.values()].map((client) => client.close())); clients.clear(); }
async function rejectsCode(action: PromiseLike<unknown>, expected: string) {
  try { await action; } catch (error) {
    const cause = error instanceof Error && error.cause ? error.cause : error;
    assert.ok(cause && typeof cause === "object" && "code" in cause);
    expect(cause.code).toBe(expected); return;
  }
  throw new Error(`Expected PostgreSQL error ${expected}`);
}
const now = async (pool: Pool) => (await pool.query("SELECT to_char(statement_timestamp() AT TIME ZONE 'UTC','YYYY-MM-DD HH24:MI:SS') AS now")).rows[0].now as string;

beforeAll(async () => {
  const admin = await server.start();
  try { for (const name of ["global", "realm"]) await admin.query(`CREATE DATABASE "${name}"`); }
  finally { await admin.end(); }
  openClients();
  for (const [role, client] of clients) await migrateDatabase(client.pool, role);
}, 120_000);
afterAll(async () => { try { await closeClients(); } finally { await server.stop(); } }, 30_000);

for (const { id, namespace, table, config, spec } of catalog) {
  test(`${id}: catalog, CRUD, defaults, constraints and rollback`, async () => {
    const { db, pool } = clients.get(spec.role)!;
    const columns = (await pool.query(`SELECT a.attname,format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull
      FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname=$1 AND c.relname=$2 AND a.attnum>0 AND NOT a.attisdropped ORDER BY a.attnum`, [namespace, config.name])).rows;
    expect(columns.map((column) => [column.attname, normalizeType(column.type), column.attnotnull]))
      .toEqual(spec.columns.map((column) => [column.name, column.type, column.notNull]));
    const indexes = (await pool.query("SELECT indexname FROM pg_indexes WHERE schemaname=$1 AND tablename=$2 ORDER BY indexname COLLATE \"C\"", [namespace, config.name])).rows.map((row) => row.indexname);
    expect(indexes).toEqual(spec.indexes.map((index) => index.name).sort());
    const original = sampleRow(spec), changed = sampleRow(spec, 2);
    const read = () => db.select().from(table);
    expect(await read()).toEqual([]);
    await db.insert(table).values(original); expect(await read()).toEqual([original]);
    await db.update(table).set(changed); expect(await read()).toEqual([changed]);
    await db.delete(table); expect(await read()).toEqual([]);
    const required: Row = {};
    for (const column of spec.columns) if (column.notNull && !column.identity && column.default === null) required[column.name] = original[column.name];
    const before = await now(pool);
    await db.insert(table).values(required);
    const defaults = await read(); expect(defaults).toHaveLength(1);
    const actual = defaults[0]! as Row, after = await now(pool);
    for (const column of spec.columns) {
      if (column.name in required) expect(actual[column.name]).toEqual(required[column.name]);
      else if (column.identity || column.default?.includes("nextval(")) expect(BigInt(actual[column.name] as bigint | string | number)).toBeGreaterThan(0n);
      else if (column.default?.startsWith("to_char(")) assert.ok(String(actual[column.name]) >= before && String(actual[column.name]) <= after);
      else expect(actual[column.name]).toEqual(literalDefault(column));
    }
    await db.delete(table); await db.insert(table).values(original);
    const nullable = { ...original };
    for (const column of spec.columns) if (!column.notNull) nullable[column.name] = null;
    await db.update(table).set(nullable); expect(await read()).toEqual([nullable]);
    await db.update(table).set(original);
    for (const column of spec.columns) {
      if (column.notNull) await rejectsCode(db.update(table).set({ [column.name]: null }), "23502");
      if (column.calendar) await rejectsCode(db.update(table).set({ [column.name]: "invalid-date" }), "23514");
    }
    for (const index of spec.indexes.filter((index) => index.kind !== "index")) {
      const duplicate = { ...changed };
      for (const column of index.columns) duplicate[column.name] = original[column.name];
      await rejectsCode(db.insert(table).values(duplicate), "23505");
    }
    for (const key of spec.foreignKeys) await rejectsCode(db.update(table).set(Object.fromEntries(key.columns.map((column) => [column, 999n]))), "23503");
    const abort = new Error("synthetic rollback");
    await expect(db.transaction(async (tx) => { await tx.update(table).set(changed); throw abort; })).rejects.toBe(abort);
    expect(await read()).toEqual([original]);
    for (const column of spec.columns.filter((column) => column.onUpdate)) {
      const other = spec.columns.find((candidate) => candidate.name !== column.name)!;
      const before = await now(pool);
      await db.update(table).set({ [other.name]: changed[other.name] });
      const [updated] = await read(); assert.ok(String((updated as Row)[column.name]) >= before && String((updated as Row)[column.name]) <= await now(pool));
      await db.update(table).set(original);
    }
    expect(await read()).toEqual([original]); completed.add(id);
  }, 15_000);
}

test("standard migrations are incremental/idempotent and enforce physical role isolation", async () => {
  for (const [role, { pool }] of clients) {
    const before = (await pool.query('SELECT count(*)::integer AS n FROM drizzle.__drizzle_migrations')).rows[0].n;
    await migrateDatabase(pool, role);
    expect((await pool.query('SELECT count(*)::integer AS n FROM drizzle.__drizzle_migrations')).rows[0].n).toBe(before);
    await expect(migrateDatabase(pool, role === "global" ? "realm" : "global")).rejects.toThrow("different role");
  }
  const admin = await server.connect();
  try { await admin.query('CREATE DATABASE "realm2"'); } finally { await admin.end(); }
  const realm2 = await server.connect("realm2");
  try {
    await migrateDatabase(realm2, "realm");
    expect((await realm2.query("SELECT count(*)::integer AS n FROM information_schema.tables WHERE table_schema='cokdb1'")).rows[0].n).toBe(659);
    expect((await realm2.query("SELECT count(*)::integer AS n FROM cokdb1.userprofile")).rows[0].n).toBe(0);
  } finally { await realm2.end(); }
});

test("PostgreSQL numeric limits, bytes, Unicode and native uint64 sequence allocation", async () => {
  const { db, pool } = clients.get("global")!;
  const messageSpec = catalog.find((entry) => entry.id === "opencok_chat.chat_message")!.spec;
  const paySpec = catalog.find((entry) => entry.id === "cokdb_pay.exchange")!.spec;
  try {
    await db.update(chat_message).set({ sequence_id: 18446744073709551615n, body: "synthetic 🐉", idempotency_key: Buffer.from([0, 255, 128, 0]) });
    expect((await db.select().from(chat_message))[0]!.sequence_id).toBe(18446744073709551615n);
    expect((await db.select().from(chat_message))[0]!.body).toBe("synthetic 🐉");
    expect((await db.select().from(chat_message))[0]!.idempotency_key).toEqual(Buffer.from([0, 255, 128, 0]));
    await rejectsCode(db.update(chat_message).set({ sequence_id: 18446744073709551616n }), "23514");
    await db.update(exchange).set({ paidGold: 9223372036854775807n, price: "99999999.99" });
    expect((await db.select().from(exchange))[0]!.paidGold).toBe(9223372036854775807n);
    expect((await db.select().from(exchange))[0]!.price).toBe("99999999.99");
    await db.update(exchange).set({ paidGold: -9223372036854775808n });
    expect((await db.select().from(exchange))[0]!.paidGold).toBe(-9223372036854775808n);
    const connection = await pool.connect();
    try {
      await connection.query("BEGIN");
      const allocated = BigInt((await connection.query("SELECT nextval('opencok_chat.chat_message_sequence_id_seq')::text AS id")).rows[0].id);
      await connection.query("ROLLBACK");
      expect(BigInt((await connection.query("SELECT nextval('opencok_chat.chat_message_sequence_id_seq')::text AS id")).rows[0].id)).toBeGreaterThan(allocated);
    } finally { connection.release(); }
  } finally { await db.update(chat_message).set(sampleRow(messageSpec)); await db.update(exchange).set(sampleRow(paySpec)); }
});

test("foreign key actions and ordinary PostgreSQL text comparisons", async () => {
  const { db } = clients.get("global")!;
  await rejectsCode(db.delete(logging_event), "23503");
  await rejectsCode(db.update(logging_event).set({ event_id: 777n }), "23503");
  const parent = catalog.find((entry) => entry.id === "cokdb_global.logging_event")!;
  const child = catalog.find((entry) => entry.id === "cokdb_global.user_tasks")!;
  await db.insert(parent.table).values({ ...sampleRow(parent.spec), event_id: 777n });
  await db.insert(child.table).values({ ...sampleRow(child.spec, 2), event_id: 777n });
  await db.update(logging_event).set({ event_id: 778n }).where(eq(logging_event.event_id, 777n));
  expect(await db.select().from(user_tasks).where(eq(user_tasks.event_id, 778n))).toHaveLength(1);
  await db.delete(logging_event).where(eq(logging_event.event_id, 778n));
  expect(await db.select().from(user_tasks)).toHaveLength(1);
  expect(await db.select().from(logging_event_property)).toHaveLength(1);
  const [row] = await db.select().from(exchange);
  expect(await db.select().from(exchange).where(eq(exchange.name, row!.name!))).toHaveLength(1);
  expect(await db.select().from(exchange).where(eq(exchange.name, `${row!.name} `))).toHaveLength(0);
});

test("every table and all 6,316 saved fields survive a PostgreSQL restart", async () => {
  expect([...completed].sort()).toEqual(catalog.map((entry) => entry.id));
  await closeClients(); await server.restart(); openClients();
  for (const { id, table, spec } of catalog) assert.deepEqual(await clients.get(spec.role)!.db.select().from(table), [sampleRow(spec)], `${id} persistence`);
}, 120_000);
