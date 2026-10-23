import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const user_logging_events = cokdb_global.table("user_logging_events", {
  "email": varchar("email", { length: 40 }).notNull().default(sql.raw("''")),
  "event_id": integer("event_id").notNull(),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
  "completeTime": bigint("completeTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_logging_events_PRIMARY", columns: [table["email"], table["event_id"]] }),
  index("user_logging_events_ULE_EVENTID_INDEX_01").on(sql.raw("\"event_id\"")),
]);
