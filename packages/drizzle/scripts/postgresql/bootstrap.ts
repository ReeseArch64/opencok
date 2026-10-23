import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool, type PoolClient } from "pg";
import { manifest } from "../../src/postgresql/manifest";
import type { DatabaseRole } from "../../src/postgresql/model";

/** Initialize an already-created, empty database. Does not create/drop physical databases. */
export async function bootstrapPostgres(connection: PoolClient, role: DatabaseRole) {
  if (!["global", "realm"].includes(role)) throw new Error("Select a PostgreSQL database role: global or realm");
  const version = Number((await connection.query("SHOW server_version_num")).rows[0].server_version_num);
  if (version < 170011 || version >= 180000) throw new Error("PostgreSQL compatibility baseline requires PostgreSQL 17.11 or newer 17.x");
  const existing = await connection.query(`SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
    WHERE n.nspname NOT IN ('pg_catalog','information_schema') AND n.nspname NOT LIKE 'pg_toast%' AND c.relkind IN ('r','p','v','m','S') LIMIT 1`);
  if (existing.rowCount) throw new Error("Fresh PostgreSQL initialization requires an empty database");
  await connection.query("SET TIME ZONE 'UTC'");
  await migrate(drizzle(connection), { migrationsFolder: join(import.meta.dir, "../../postgresql/migrations", role) });
  const counts = await connection.query(`SELECT count(*)::integer AS tables FROM information_schema.tables WHERE table_schema IN ('cokdb1','cokdb_global','cokdb_pay','opencok_chat') AND table_type='BASE TABLE'`);
  if (counts.rows[0].tables !== manifest.tables.filter((table) => table.role === role).length) throw new Error("PostgreSQL baseline inventory mismatch");
}

if (import.meta.main) {
  const role = process.argv.includes("--global") ? "global" : process.argv.includes("--realm") ? "realm" : undefined;
  let pool: Pool | undefined;
  try {
    if (!role || !process.env.POSTGRES_URL) throw new Error("Set POSTGRES_URL for an empty database and choose --global or --realm");
    pool = new Pool({ connectionString: process.env.POSTGRES_URL, options: "-c timezone=UTC" });
    const connection = await pool.connect();
    try { await bootstrapPostgres(connection, role); } finally { connection.release(); }
    console.log(`Initialized PostgreSQL ${role} compatibility schema`);
  } catch (error) {
    // Driver exceptions can contain values, SQL or connection credentials.
    console.error(error && typeof error === "object" && "code" in error ? `PostgreSQL initialization failed (${error.code})` : "PostgreSQL initialization failed; verify the empty target, role and supported version");
    process.exitCode = 1;
  } finally { await pool?.end(); }
}
