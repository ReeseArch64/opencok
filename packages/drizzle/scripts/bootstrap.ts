import { join } from "node:path";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection, type Connection, type RowDataPacket } from "mysql2/promise";
import inventory from "../inventory.json";
import { legacyDriverOptions } from "../src/client";
import { databaseNames, quoteIdentifier, readLegacy } from "./legacy-sql";

export async function bootstrap(connection: Connection, localInputDirectory?: string) {
  // Validate every input before DDL. A different dump needs a new reviewed baseline.
  const legacy = localInputDirectory ? await readLegacy(localInputDirectory) : undefined;
  if (legacy && legacy.inputs.some((input) => inventory.inputs.find((known) => known.name === input.name)?.sha256 !== input.sha256)) {
    throw new Error("Local SQL inputs differ from the reviewed inventory");
  }
  const [databases] = await connection.query<RowDataPacket[]>(
    "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME IN (?, ?, ?, ?)",
    [...databaseNames],
  );
  if (databases.length) throw new Error("Fresh initialization requires all four legacy databases to be absent");
  for (const database of databaseNames) {
    const charset = database === "opencok_chat" ? "utf8mb4 COLLATE utf8mb4_unicode_ci" : "utf8 COLLATE utf8_general_ci";
    await connection.query(`CREATE DATABASE ${quoteIdentifier(database)} CHARACTER SET ${charset}`);
    // USE alone leaves mysql2's prepared journal query bound to the previous
    // database. changeUser resets that cache before Drizzle reads the journal.
    await connection.changeUser({ database });
    try {
      await migrate(drizzle(connection), { migrationsFolder: join(import.meta.dir, "../migrations", database) });
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? error.code : "DDL_ERROR";
      throw new Error(`Baseline migration failed in ${database} (${code})`);
    }
    const [counts] = await connection.query<RowDataPacket[]>(
      "SELECT COUNT(*) AS total FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME <> '__drizzle_migrations'",
      [database],
    );
    if (Number(counts[0]!.total) !== inventory.databases[database]) {
      throw new Error(`Baseline table count mismatch in ${database}: ${counts[0]!.total}`);
    }
  }
  if (legacy) {
    // Original statements are executed locally, in source order, after all tables
    // exist. Their data and program bodies never become repository artifacts.
    for (const input of legacy.inputs) {
      const database = databaseNames.find((db) => input.name === `${db}.sql`);
      if (database) await connection.query(`USE ${quoteIdentifier(database)}`);
      for (const [position, statement] of input.statements.entries()) {
        if (/^(?:CREATE|DROP) TABLE\b/i.test(statement)) continue;
        try {
          await connection.query(statement);
        } catch (error) {
          const code = error && typeof error === "object" && "code" in error ? error.code : "SQL_ERROR";
          const missing = code === "ER_NO_SUCH_TABLE" && error && typeof error === "object" && "sqlMessage" in error
            ? String(error.sqlMessage).match(/Table '([\w.]+)' doesn't exist/)?.[1] : undefined;
          throw new Error(`Local initialization failed in ${input.name}, statement ${position + 1} (${code}${missing ? `: ${missing}` : ""})`);
        }
      }
    }
  }
}

if (import.meta.main) {
  let connection: Connection | undefined;
  try {
    if (!process.env.MARIADB_URL) throw new Error("Set MARIADB_URL for a fresh MariaDB instance");
    const withLocalInputs = process.argv.includes("--with-local-inputs");
    if (withLocalInputs && !process.env.LEGACY_SQL_DIR) throw new Error("Set LEGACY_SQL_DIR for local initialization statements");
    connection = await createConnection({ uri: process.env.MARIADB_URL, ...legacyDriverOptions });
    await bootstrap(connection, withLocalInputs ? process.env.LEGACY_SQL_DIR : undefined);
    console.log(`Initialized four legacy databases${withLocalInputs ? " with local programs and seeds" : " (tables only)"}`);
  } catch (error) {
    // mysql2 errors can embed the complete query and private values.
    console.error(error && typeof error === "object" && "code" in error ? `MariaDB initialization failed (${error.code})` : error instanceof Error ? error.message : "Initialization failed");
    process.exitCode = 1;
  } finally {
    await connection?.end();
  }
}
