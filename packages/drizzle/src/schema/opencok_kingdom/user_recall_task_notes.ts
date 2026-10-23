import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_recall_task_notes = opencok_kingdom.table(
  "user_recall_task_notes",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "version": varchar("version", { length: 255 }).notNull(),
    "receive_mode": integer("receive_mode").notNull().default(sql.raw("0")),
    "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "beginTime": bigint("beginTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "opendTime": bigint("opendTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "country": varchar("country", { length: 40 }).notNull().default(sql.raw("''")),
    "endTime": bigint("endTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "user_recall_task_notes_PRIMARY", columns: [table["uid"]] })],
);
