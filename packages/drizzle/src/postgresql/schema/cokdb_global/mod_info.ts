// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const mod_info = cokdb_global.table("mod_info", {
  "uid": legacyText("uid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "lang": legacyText("lang", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "server": legacyText("server", {"sqlType":"character varying(255)","collation":"C"}),
}, (table) => [
  primaryKey({ name: "mod_info_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("mod_info_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("mod_info_mod_info_fk_01").on(sql.raw("rtrim(\"server\", ' ') COLLATE \"C\"")),
  index("mod_info_lang_index").on(sql.raw("rtrim(\"lang\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
