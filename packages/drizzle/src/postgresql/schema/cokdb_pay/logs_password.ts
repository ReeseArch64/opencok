// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const logs_password = cokdb_pay.table("logs_password", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "old_password": legacyText("old_password", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "new_password": legacyText("new_password", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "time": legacyTemporal("time").default(sql.raw("'0000-00-00 00:00:00'")),
  "serverid": integer("serverid").default(sql.raw("0")),
  "ip": legacyText("ip", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (_table) => [
  check("logs_password_time_temporal", sql.raw("legacy_meta.valid_temporal(\"time\", 'datetime', 0)")),
]);
