// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const stat_phone = cokdb1.table("stat_phone", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "model": legacyText("model", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "version": legacyText("version", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "width": integer("width"),
  "height": integer("height"),
}, (table) => [
  primaryKey({ name: "stat_phone_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("stat_phone_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
