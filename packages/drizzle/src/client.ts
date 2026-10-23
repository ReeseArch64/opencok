import { drizzle } from "drizzle-orm/mysql2";
import { createPool, type PoolOptions } from "mysql2/promise";
import * as schemas from "./schema";

export type LegacyDatabaseName = keyof typeof schemas;

export const legacyDriverOptions = {
  supportBigNumbers: true,
  bigNumberStrings: true,
  decimalNumbers: false,
  dateStrings: true,
  timezone: "Z",
  multipleStatements: false,
} as const;

/** One pool per original database; identifiers are never silently remapped. */
export function createLegacyDatabase<T extends LegacyDatabaseName>(
  database: T,
  options: Omit<PoolOptions, "database" | "uri" | "typeCast" | keyof typeof legacyDriverOptions>,
) {
  const pool = createPool({ ...options, ...legacyDriverOptions, database });
  const db = drizzle(pool, { schema: schemas[database], mode: "default" });
  return { db, pool, close: () => pool.end() };
}
