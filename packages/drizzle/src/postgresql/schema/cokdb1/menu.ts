// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const menu = cokdb1.table("menu", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "menu_id_seq", startWith: 1 }),
  "module_id": integer("module_id"),
  "name": legacyText("name", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "pinyin": legacyText("pinyin", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "path": legacyText("path", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "type": legacyText("type", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "p_id": integer("p_id"),
  "comments": legacyText("comments", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "is_prod": smallint("is_prod"),
  "is_log": smallint("is_log"),
  "order_num": legacyText("order_num", {"sqlType":"character varying(9)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "menu_PRIMARY", columns: [table["id"]] }),
  check("menu_is_prod_range", sql.raw("\"is_prod\" BETWEEN -128 AND 127")),
  check("menu_is_log_range", sql.raw("\"is_log\" BETWEEN -128 AND 127")),
]);
