// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const innercityskin = cokdb1.table("innercityskin", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "style": legacyText("style", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("'-1'")),
  "zoom": legacyText("zoom", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "show_type": legacyText("show_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("'-1'")),
  "time": legacyText("time", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "innercityskin_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("innercityskin_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
