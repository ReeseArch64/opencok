// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_vedio = cokdb1.table("alliance_vedio", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "vedioURL": legacyText("vedioURL", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "thumbnailURL": legacyText("thumbnailURL", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "vedioW": integer("vedioW").notNull().default(sql.raw("0")),
  "vedioH": integer("vedioH").notNull().default(sql.raw("0")),
  "vedioSize": integer("vedioSize").notNull().default(sql.raw("0")),
  "vedioLength": integer("vedioLength").notNull().default(sql.raw("0")),
  "checkSign": smallint("checkSign").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_vedio_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("alliance_vedio_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("alliance_vedio_checkSign_range", sql.raw("\"checkSign\" BETWEEN -128 AND 127")),
]);
