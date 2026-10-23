import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import type { DatabaseRole } from "./model";

/** One physical PostgreSQL database per pool; namespace-qualified tables avoid search_path ambiguity. */
export function createPostgresDatabase(role: DatabaseRole, config: PoolConfig) {
  const pool = new Pool({ ...config, options: `${config.options ?? ""} -c timezone=UTC` });
  const db = drizzle(pool);
  return { role, db, pool, close: () => pool.end() };
}
