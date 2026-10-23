// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_title = cokdb1.table("alliance_title", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "title": integer("title").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "uName": legacyText("uName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "applicant": legacyText("applicant", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_title_PRIMARY", columns: [table["allianceId"], table["title"]] }),
  uniqueIndex("alliance_title_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"title\"")),
]);
