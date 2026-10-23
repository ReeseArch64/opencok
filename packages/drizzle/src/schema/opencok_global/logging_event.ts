import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const logging_event = opencok_global.table("logging_event", {
  "timestmp": bigint("timestmp", { mode: "bigint" }).notNull(),
  "formatted_message": text("formatted_message").notNull(),
  "logger_name": varchar("logger_name", { length: 254 }).notNull(),
  "level_string": varchar("level_string", { length: 254 }).notNull(),
  "thread_name": varchar("thread_name", { length: 254 }),
  "reference_flag": smallint("reference_flag"),
  "arg0": varchar("arg0", { length: 254 }),
  "arg1": varchar("arg1", { length: 254 }),
  "arg2": varchar("arg2", { length: 254 }),
  "arg3": varchar("arg3", { length: 254 }),
  "caller_filename": varchar("caller_filename", { length: 254 }).notNull(),
  "caller_class": varchar("caller_class", { length: 254 }).notNull(),
  "caller_method": varchar("caller_method", { length: 254 }).notNull(),
  "caller_line": varchar("caller_line", { length: 4 }).notNull(),
  "event_id": bigint("event_id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"logging_event_event_id_seq","startWith":1}),
}, (table) => [
  primaryKey({ name: "logging_event_PRIMARY", columns: [table["event_id"]] }),
  index("logging_event_format_msg_idx").on(sql.raw("left(\"formatted_message\", 100)")),
  index("logging_event_arg_index").on(sql.raw("\"arg0\""), sql.raw("\"arg1\""), sql.raw("\"arg2\"")),
]);
