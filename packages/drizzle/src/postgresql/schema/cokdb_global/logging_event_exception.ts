// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const logging_event_exception = cokdb_global.table("logging_event_exception", {
  "event_id": bigint("event_id", { mode: "bigint" }).notNull(),
  "i": smallint("i").notNull(),
  "trace_line": legacyText("trace_line", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "logging_event_exception_PRIMARY", columns: [table["event_id"], table["i"]] }),
  index("logging_event_exception_trace_line_idx").on(sql.raw("rtrim(left(\"trace_line\", 255), ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
