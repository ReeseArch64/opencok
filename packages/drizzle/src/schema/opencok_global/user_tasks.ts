import { sql } from "drizzle-orm";
import { bigint, foreignKey, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";
import { logging_event } from "./logging_event";

export const user_tasks = opencok_global.table(
  "user_tasks",
  {
    "email": varchar("email", { length: 40 }).notNull().default(sql.raw("''")),
    "event_id": bigint("event_id", { mode: "bigint" }).notNull(),
    "type": integer("type").notNull(),
    "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
    "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_tasks_PRIMARY", columns: [table["email"], table["event_id"]] }),
    index("user_tasks_event_id").on(sql.raw('"event_id"')),
    foreignKey({
      name: "user_tasks_user_tasks_ibfk_1",
      columns: [table["event_id"]],
      foreignColumns: [logging_event["event_id"]],
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  ],
);
