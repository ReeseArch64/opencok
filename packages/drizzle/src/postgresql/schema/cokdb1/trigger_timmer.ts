// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const trigger_timmer = cokdb1.table("trigger_timmer", {
  "timmer_name": legacyText("timmer_name", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "last_exec_millis": bigint("last_exec_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "trigger_timmer_PRIMARY", columns: [table["timmer_name"]] }),
  uniqueIndex("trigger_timmer_PRIMARY_pad").on(sql.raw("rtrim(\"timmer_name\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
