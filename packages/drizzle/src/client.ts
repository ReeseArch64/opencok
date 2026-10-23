import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import type { DatabaseRole } from "./roles";
import * as globalSchema from "./schema/global";
import * as realmSchema from "./schema/realm";

const schemas = { global: globalSchema, realm: realmSchema };

/** Create one owned PostgreSQL pool for the global database or a single realm. */
export function createDatabase<T extends DatabaseRole>(role: T, config: PoolConfig) {
  if (role !== "global" && role !== "realm") throw new Error("Unknown database role");
  const pool = new Pool({ ...config, options: `${config.options ?? ""} -c timezone=UTC` });
  const db = drizzle(pool, { schema: schemas[role] });
  return { role, db, pool, close: () => pool.end() };
}
