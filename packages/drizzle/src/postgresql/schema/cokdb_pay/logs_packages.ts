// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const logs_packages = cokdb_pay.table("logs_packages", {
  "usn": integer("usn"),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "packid": integer("packid"),
  "price": integer("price"),
  "originalpoints": legacyText("originalpoints", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "points": legacyText("points", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "time": legacyTemporal("time").default(sql.raw("'0000-00-00 00:00:00'")),
  "serverid": integer("serverid").default(sql.raw("0")),
  "db": legacyText("db", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "ip": legacyText("ip", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "browser": legacyText("browser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "os": legacyText("os", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (_table) => [
  check("logs_packages_time_temporal", sql.raw("legacy_meta.valid_temporal(\"time\", 'datetime', 0)")),
]);
