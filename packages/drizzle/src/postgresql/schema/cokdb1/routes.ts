// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const routes = cokdb1.table("routes", {
  "route_id": integer("route_id").notNull().generatedByDefaultAsIdentity({ name: "routes_route_id_seq", startWith: 1 }),
  "module_id": integer("module_id"),
  "route_name": legacyText("route_name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "route_path": legacyText("route_path", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "log_tag": smallint("log_tag").default(sql.raw("0")),
  "prt_id": integer("prt_id"),
  "order_num": legacyText("order_num", {"sqlType":"character varying(12)","collation":"legacy_meta.ci"}),
  "pinyin": legacyText("pinyin", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "isProd": smallint("isProd").default(sql.raw("1")),
  "type": legacyText("type", {"sqlType":"character varying(6)","collation":"legacy_meta.ci"}).default(sql.raw("'other'")),
}, (table) => [
  primaryKey({ name: "routes_PRIMARY", columns: [table["route_id"]] }),
  check("routes_log_tag_range", sql.raw("\"log_tag\" BETWEEN -128 AND 127")),
  check("routes_isProd_range", sql.raw("\"isProd\" BETWEEN -128 AND 127")),
]);
