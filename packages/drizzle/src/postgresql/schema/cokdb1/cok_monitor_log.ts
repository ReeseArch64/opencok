// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const cok_monitor_log = cokdb1.table("cok_monitor_log", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "cok_monitor_log_id_seq", startWith: 1 }),
  "url": legacyText("url", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
  "action": legacyText("action", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "parameter": legacyText("parameter", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "user_name": legacyText("user_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "access_time": legacyTemporal("access_time"),
  "module_id": integer("module_id"),
}, (table) => [
  primaryKey({ name: "cok_monitor_log_PRIMARY", columns: [table["id"]] }),
  check("cok_monitor_log_access_time_temporal", sql.raw("legacy_meta.valid_temporal(\"access_time\", 'datetime', 0)")),
]);
