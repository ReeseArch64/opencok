// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const logging_event = cokdb_global.table("logging_event", {
  "timestmp": bigint("timestmp", { mode: "bigint" }).notNull(),
  "formatted_message": legacyText("formatted_message", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "logger_name": legacyText("logger_name", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "level_string": legacyText("level_string", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "thread_name": legacyText("thread_name", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}),
  "reference_flag": smallint("reference_flag"),
  "arg0": legacyText("arg0", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}),
  "arg1": legacyText("arg1", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}),
  "arg2": legacyText("arg2", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}),
  "arg3": legacyText("arg3", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}),
  "caller_filename": legacyText("caller_filename", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "caller_class": legacyText("caller_class", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "caller_method": legacyText("caller_method", {"sqlType":"character varying(254)","collation":"legacy_meta.ci"}).notNull(),
  "caller_line": legacyText("caller_line", {"sqlType":"character varying(4)","collation":"legacy_meta.ci"}).notNull(),
  "event_id": bigint("event_id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "logging_event_event_id_seq", startWith: 1 }),
}, (table) => [
  primaryKey({ name: "logging_event_PRIMARY", columns: [table["event_id"]] }),
  index("logging_event_format_msg_idx").on(sql.raw("rtrim(left(\"formatted_message\", 100), ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("logging_event_arg_index").on(sql.raw("rtrim(\"arg0\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"arg1\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"arg2\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
