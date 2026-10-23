import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const redis_cfg_backup = cokdb1.table("redis_cfg_backup", {
  "keyFlag": varchar("keyFlag", { length: 128 }).notNull(),
  "info": varchar("info", { length: 2048 }).default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "redis_cfg_backup_PRIMARY", columns: [table["keyFlag"]] }),
]);
