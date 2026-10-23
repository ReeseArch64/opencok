import { expect, test } from "bun:test";
import { bootstrapPostgres } from "../scripts/postgresql/bootstrap";
import { DisposablePostgres } from "./support/postgres";

test("PostgreSQL bootstrap creates all tables and initializes another isolated realm", async () => {
  const server = new DisposablePostgres();
  try {
    const admin = await server.start();
    try {
      for (const [name, role, count] of [["global", "global", 113], ["realm1", "realm", 659], ["realm2", "realm", 659]] as const) {
        await admin.query(`CREATE DATABASE "${name}"`);
        const pool = await server.connect(name);
        try {
          const connection = await pool.connect();
          try {
            await bootstrapPostgres(connection, role);
            expect((await connection.query(`SELECT count(*)::integer AS count FROM information_schema.tables WHERE table_schema IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat')`)).rows[0].count).toBe(count);
            await expect(bootstrapPostgres(connection, role)).rejects.toThrow("empty database");
          } finally { connection.release(); }
        } finally { await pool.end(); }
      }
    } finally { await admin.end(); }
  } finally { await server.stop(); }
}, 120_000);
