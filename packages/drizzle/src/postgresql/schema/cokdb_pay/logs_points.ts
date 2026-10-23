// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const logs_points = cokdb_pay.table("logs_points", {
  "usn": integer("usn"),
  "Transaction_ID": legacyText("Transaction_ID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "points": legacyText("points", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "old_points": legacyText("old_points", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "new_points": legacyText("new_points", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "time": legacyTemporal("time").default(sql.raw("'0000-00-00 00:00:00'")),
}, (_table) => [
  check("logs_points_time_temporal", sql.raw("legacy_meta.valid_temporal(\"time\", 'datetime', 0)")),
]);
