import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const trigger_timmer = cokdb1.table("trigger_timmer", {
  "timmer_name": varchar("timmer_name", { length: 200 }).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "last_exec_millis": bigint("last_exec_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "trigger_timmer_PRIMARY", columns: [table["timmer_name"]] }),
]);
