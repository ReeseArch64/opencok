import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const server_merge_task = cokdb1.table("server_merge_task", {
  "id": varchar("id", { length: 40 }).notNull(),
  "src_server": varchar("src_server", { length: 255 }).notNull().default(sql.raw("''")),
  "dst_server": varchar("dst_server", { length: 255 }).notNull().default(sql.raw("''")),
  "merge_reason": text("merge_reason").notNull(),
  "apply_time": bigint("apply_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "merge_time": bigint("merge_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_merge_task_PRIMARY", columns: [table["id"]] }),
]);
