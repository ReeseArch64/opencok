import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_target_task_notes = cokdb1.table("user_target_task_notes", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "version": varchar("version", { length: 255 }).notNull(),
  "receive_mode": integer("receive_mode").notNull().default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "beginTime": bigint("beginTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "opendTime": bigint("opendTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "isMail": integer("isMail").notNull().default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_target_task_notes_PRIMARY", columns: [table["uid"]] }),
]);
