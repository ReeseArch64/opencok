import { afterAll, beforeAll, expect, test } from "bun:test";
import assert from "node:assert/strict";
import { eq, getTableName, sql } from "drizzle-orm";
import type { AnyMySqlTable } from "drizzle-orm/mysql-core";
import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { bootstrap } from "../scripts/bootstrap";
import { databaseNames } from "../scripts/legacy-sql";
import { createLegacyDatabase } from "../src/client";
import { logging_event, logging_event_property, user_tasks } from "../src/schema/cokdb_global";
import { exchange } from "../src/schema/cokdb_pay";
import { chat_message } from "../src/schema/opencok_chat";
import fixture from "./fixtures/mariadb-contract.json";
import { catalog, nativeContract, type Contract } from "./support/contract";
import { DisposableMariaDB } from "./support/mariadb";
import { literalDefault, sampleRow, type Row } from "./support/rows";

const contract = fixture as unknown as Contract;
function fixtureRow<T extends AnyMySqlTable>(database: string, table: T, variant = 1): T["$inferSelect"] {
  return sampleRow(contract.tables[`${database}.${getTableName(table)}`]!, variant) as T["$inferSelect"];
}
const server = new DisposableMariaDB();
// The table-driven harness uses query builders, not schema-specific relations.
const clients = new Map<string, { db: MySql2Database; pool: Pool; close: () => Promise<void> }>();
const completed = new Set<string>();
const openClients = () => {
  for (const database of databaseNames) {
    const client = createLegacyDatabase(database, server.options);
    clients.set(database, { ...client, db: client.db as unknown as MySql2Database });
  }
};
async function closeClients() {
  const results = await Promise.allSettled([...clients.values()].map((client) => client.close()));
  clients.clear();
  for (const result of results) if (result.status === "rejected") throw result.reason;
}
async function rejectsCode(action: PromiseLike<unknown>, code: string) {
  try { await action; } catch (error) {
    const cause = error instanceof Error && error.cause ? error.cause : error;
    assert.ok(cause && typeof cause === "object" && "code" in cause);
    expect(cause.code).toBe(code);
    return;
  }
  throw new Error(`Expected database error ${code}`);
}

beforeAll(async () => {
  const connection = await server.start();
  try {
    const [version] = await connection.query<RowDataPacket[]>("SELECT VERSION() AS version");
    expect(version[0]!.version).toStartWith("10.4.33");
    // Exercise the public migrator from an empty server, without private dumps.
    await bootstrap(connection);
    expect(await nativeContract(connection)).toEqual(contract);
    await expect(bootstrap(connection)).rejects.toThrow("requires all four");
  } finally { await connection.end(); }
  openClients();
}, 120_000);

afterAll(async () => {
  try { await closeClients(); } finally { await server.stop(); }
}, 30_000);

for (const entry of catalog) {
  test(`${entry.id}: all-field CRUD, defaults, nullability, keys and engine semantics`, async () => {
    const { db, pool } = clients.get(entry.database)!;
    const native = contract.tables[entry.id]!;
    const original = sampleRow(native);
    const changed = sampleRow(native, 2);
    const read = () => db.select().from(entry.table);
    expect(await read()).toHaveLength(0);
    await db.insert(entry.table).values(original);
    expect(await read()).toEqual([original]);
    await db.update(entry.table).set(changed);
    expect(await read()).toEqual([changed]);
    await db.delete(entry.table);
    expect(await read()).toEqual([]);

    // Omit every column allowed to be omitted, and verify each resulting value.
    const required: Row = {};
    for (const [name, , notNull, defaultSql, auto] of native.columns) {
      if (notNull && defaultSql === null && !auto) required[name] = original[name];
    }
    // Nullable FK defaults are NULL; required FKs use the persisted parent fixture.
    const [before] = await pool.query<RowDataPacket[]>("SELECT CAST(CURRENT_TIMESTAMP() AS CHAR) AS now");
    await db.insert(entry.table).values(required);
    const defaultRows = await read();
    expect(defaultRows).toHaveLength(1);
    const actual = defaultRows[0]! as Row;
    const [after] = await pool.query<RowDataPacket[]>("SELECT CAST(CURRENT_TIMESTAMP() AS CHAR) AS now");
    for (const column of native.columns) {
      const [name, , , defaultSql, auto] = column;
      if (name in required) expect(actual[name]).toEqual(required[name]);
      else if (auto) expect(BigInt(actual[name] as string | number | bigint)).toBeGreaterThan(0n);
      else if (defaultSql === "current_timestamp()") {
        expect(typeof actual[name]).toBe("string");
        assert.ok(String(actual[name]) >= before[0]!.now && String(actual[name]) <= after[0]!.now, `${entry.id}.${name} server clock`);
      } else expect(actual[name]).toEqual(literalDefault(column));
    }
    await db.delete(entry.table);
    await db.insert(entry.table).values(original);

    const nullable = { ...original };
    for (const [name, , notNull] of native.columns) if (!notNull) nullable[name] = null;
    await db.update(entry.table).set(nullable);
    expect(await read()).toEqual([nullable]);
    await db.update(entry.table).set(original);
    for (const [name, type, notNull] of native.columns) {
      if (!notNull) continue;
      if (type.startsWith("timestamp")) {
        // MariaDB 10.4 assigns CURRENT_TIMESTAMP for NULL on NOT NULL TIMESTAMP.
        await db.transaction(async (tx) => {
          await tx.execute(sql`SET timestamp = 1609459200`);
          try {
            await tx.update(entry.table).set({ [name]: null });
            const [row] = await tx.select().from(entry.table);
            expect((row as Row)[name]).toBe("2021-01-01 00:00:00");
          } finally { await tx.execute(sql`SET timestamp = 0`); }
        });
        await db.update(entry.table).set(original);
      } else await rejectsCode(db.update(entry.table).set({ [name]: null }), "ER_BAD_NULL_ERROR");
    }

    for (const [, unique, columns] of native.indexes) {
      if (!unique) continue;
      const duplicate = { ...changed };
      for (const [name] of columns) duplicate[name] = original[name];
      await rejectsCode(db.insert(entry.table).values(duplicate), "ER_DUP_ENTRY");
    }
    for (const [, columns] of native.foreignKeys) {
      await rejectsCode(db.update(entry.table).set(Object.fromEntries(columns.map((name) => [name, 999n]))), "ER_NO_REFERENCED_ROW_2");
    }

    const abort = new Error("synthetic rollback");
    await expect(db.transaction(async (tx) => {
      await tx.update(entry.table).set(changed);
      throw abort;
    })).rejects.toBe(abort);
    if (native.engine === "InnoDB") expect(await read()).toEqual([original]);
    else {
      // MyISAM deliberately has no rollback guarantee; still covers every CRUD path.
      expect(native.engine).toBe("MyISAM");
      expect(await read()).toEqual([changed]);
      await db.update(entry.table).set(original);
    }
    // Test database-managed ON UPDATE using a deterministic session clock.
    for (const [name, , , , , onUpdate] of native.columns) {
      if (!onUpdate) continue;
      const column = entry.config.columns.find((column) => column.name !== name)!;
      await db.transaction(async (tx) => {
        await tx.execute(sql`SET timestamp = 1609459200`);
        try {
          await tx.update(entry.table).set({ [column.name]: changed[column.name] });
          const [row] = await tx.select().from(entry.table);
          expect((row as Row)[name]).toBe("2021-01-01 00:00:00");
        } finally { await tx.execute(sql`SET timestamp = 0`); }
      });
      await db.update(entry.table).set(original);
    }
    expect(await read()).toEqual([original]);
    completed.add(entry.id);
  }, 15_000);
}

test("exact bigint/decimal boundaries, binary idempotency and four-byte chat text", async () => {
  const chat = clients.get("opencok_chat")!.db;
  const pay = clients.get("cokdb_pay")!.db;
  const message = fixtureRow("opencok_chat", chat_message);
  const payment = fixtureRow("cokdb_pay", exchange);
  try {
    const boundary = { sequence_id: 18446744073709551615n, body: "synthetic 🐉", idempotency_key: Buffer.from([0, 255, 128, 39, 92, 0]) };
    await chat.update(chat_message).set(boundary);
    expect(await chat.select().from(chat_message)).toEqual([{ ...message, ...boundary }]);
    await rejectsCode(chat.insert(chat_message).values({ ...message, sequence_id: 2n, idempotency_key: boundary.idempotency_key }), "ER_DUP_ENTRY");
    await pay.update(exchange).set({ paidGold: 9223372036854775807n, price: "99999999.99" });
    expect(await pay.select().from(exchange)).toEqual([{ ...payment, paidGold: 9223372036854775807n, price: "99999999.99" }]);
    await pay.update(exchange).set({ paidGold: -9223372036854775808n });
    expect((await pay.select().from(exchange))[0]!.paidGold).toBe(-9223372036854775808n);
  } finally {
    await chat.update(chat_message).set(message);
    await pay.update(exchange).set(payment);
  }
});

test("logging_event_property restricts parent delete and update", async () => {
  const db = clients.get("cokdb_global")!.db;
  await rejectsCode(db.delete(logging_event), "ER_ROW_IS_REFERENCED_2");
  await rejectsCode(db.update(logging_event).set({ event_id: 777n }), "ER_ROW_IS_REFERENCED_2");
  expect(await db.select().from(logging_event_property)).toEqual([fixtureRow("cokdb_global", logging_event_property)]);
});

test("user_tasks cascades parent update and delete without touching the retained fixture", async () => {
  const db = clients.get("cokdb_global")!.db;
  // A separate synthetic parent avoids interference from the RESTRICT child above.
  await db.insert(logging_event).values({ ...fixtureRow("cokdb_global", logging_event), event_id: 777n });
  await db.insert(user_tasks).values({ ...fixtureRow("cokdb_global", user_tasks, 2), event_id: 777n });
  await db.update(logging_event).set({ event_id: 778n }).where(eq(logging_event.event_id, 777n));
  expect(await db.select().from(user_tasks).where(eq(user_tasks.event_id, 778n))).toHaveLength(1);
  expect(await db.select().from(user_tasks).where(eq(user_tasks.event_id, 777n))).toHaveLength(0);
  await db.delete(logging_event).where(eq(logging_event.event_id, 778n));
  expect(await db.select().from(user_tasks)).toEqual([fixtureRow("cokdb_global", user_tasks)]);
});

test("all 772 tables and 6,316 fields survive a MariaDB restart", async () => {
  expect([...completed].sort()).toEqual(catalog.map((entry) => entry.id));
  await closeClients();
  const connection = await server.restart();
  await connection.end();
  openClients();
  for (const entry of catalog) {
    const { db } = clients.get(entry.database)!;
    assert.deepEqual(await db.select().from(entry.table), [sampleRow(contract.tables[entry.id]!)], `${entry.id} restart persistence`);
  }
}, 120_000);
