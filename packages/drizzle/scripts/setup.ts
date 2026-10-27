import { Pool, type PoolConfig } from "pg";
import { env, EnvironmentError, requireEnv } from "@opencok/env/database";
import {
  databasePoolConfig,
  defaultDatabaseTopology,
  validateTopology,
  type DatabaseTopology,
} from "../src/topology";
import { migrateDatabase } from "./migrate";

export async function setupDatabases(
  admin: Pool,
  config: PoolConfig,
  topology: DatabaseTopology = defaultDatabaseTopology,
) {
  const resolved = validateTopology(topology);
  const targets = [
    { role: "global" as const, database: resolved.globalDatabase },
    ...resolved.kingdoms.map((kingdom) => ({
      role: "kingdom" as const,
      database: kingdom.database,
    })),
  ].map((target) => ({ ...target, config: databasePoolConfig(config, target.database) }));
  const client = await admin.connect();
  try {
    await client.query("SELECT pg_advisory_lock(1936028531,2)");
    for (const target of targets) {
      const existing = await client.query("SELECT 1 FROM pg_database WHERE datname=$1", [
        target.database,
      ]);
      if (!existing.rowCount) {
        try {
          await client.query(`CREATE DATABASE "${target.database}"`);
        } catch (error) {
          if (!(error && typeof error === "object" && "code" in error && error.code === "42P04"))
            {throw error;}
        }
      }
      const pool = new Pool({
        ...target.config,
        options: `${target.config.options ?? ""} -c timezone=UTC`,
      });
      try {
        await migrateDatabase(pool, target.role);
      } finally {
        await pool.end();
      }
    }
    return resolved;
  } finally {
    try {
      await client.query("SELECT pg_advisory_unlock(1936028531,2)");
    } finally {
      client.release();
    }
  }
}

if (import.meta.main) {
  let admin: Pool | undefined;
  try {
    const url = new URL(env.POSTGRES_ADMIN_URL ?? requireEnv("DATABASE_URL"));
    url.pathname = "/postgres";
    url.searchParams.delete("database");
    const config = { connectionString: url.href, options: "-c timezone=UTC" };
    admin = new Pool(config);
    const topology = await setupDatabases(admin, config);
    console.log(`Initialized shared global database and ${topology.kingdoms.length} kingdoms`);
  } catch (error) {
    console.error(
      error instanceof EnvironmentError
        ? error.message
        : error && typeof error === "object" && "code" in error
          ? `PostgreSQL setup failed (${error.code})`
          : "PostgreSQL setup failed; verify administrative connection, topology and pending migrations",
    );
    process.exitCode = 1;
  } finally {
    await admin?.end();
  }
}
