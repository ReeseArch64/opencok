import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { EnvironmentError, requireEnv } from "@opencok/env/database";
import { databaseSchemas, type DatabaseRole } from "../src/roles";

export async function migrateDatabase(pool: Pool, role: DatabaseRole) {
  if (role !== "global" && role !== "kingdom") throw new Error("Unknown database role");
  const client = await pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock(1936028531,1)");
    const otherSchemas = [
      ...Object.entries(databaseSchemas)
        .filter(([key]) => key !== role)
        .flatMap(([, schemas]) => [...schemas]),

      ...(role === "global" ? ["cokdb1"] : ["cokdb_global", "cokdb_pay"]),
    ];
    const existing = await client.query(
      "SELECT nspname FROM pg_namespace WHERE nspname=ANY($1::text[])",
      [otherSchemas],
    );
    if (existing.rowCount)
      throw new Error("Database contains schemas belonging to a different role");
    await migrate(drizzle(client), {
      migrationsFolder: join(import.meta.dir, "../migrations", role),
    });
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock(1936028531,1)");
    } finally {
      client.release();
    }
  }
}

if (import.meta.main) {
  let pool: Pool | undefined;
  try {
    const role = requireEnv("DATABASE_ROLE");
    pool = new Pool({ connectionString: requireEnv("DATABASE_URL"), options: "-c timezone=UTC" });
    await migrateDatabase(pool, role);
    console.log(`Applied PostgreSQL migrations for ${role}`);
  } catch (error) {
    console.error(
      error instanceof EnvironmentError
        ? error.message
        : error && typeof error === "object" && "code" in error
          ? `PostgreSQL migration failed (${error.code})`
          : "PostgreSQL migration failed; verify DATABASE_URL, DATABASE_ROLE and pending SQL",
    );
    process.exitCode = 1;
  } finally {
    await pool?.end();
  }
}
