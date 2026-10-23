import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const logging_event_exception = opencok_global.table(
  "logging_event_exception",
  {
    "event_id": bigint("event_id", { mode: "bigint" }).notNull(),
    "i": smallint("i").notNull(),
    "trace_line": varchar("trace_line", { length: 1024 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "logging_event_exception_PRIMARY",
      columns: [table["event_id"], table["i"]],
    }),
    index("logging_event_exception_trace_line_idx").on(sql.raw('left("trace_line", 255)')),
  ],
);
