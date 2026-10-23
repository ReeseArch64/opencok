// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const territory_user_effect = cokdb1.table("territory_user_effect", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "pointId": integer("pointId").notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"C"}),
  "stat": integer("stat"),
  "active": integer("active"),
}, (table) => [
  primaryKey({ name: "territory_user_effect_PRIMARY", columns: [table["uid"], table["pointId"]] }),
  uniqueIndex("territory_user_effect_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"pointId\"")),
  index("territory_user_effect_alliance_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\"")),
]);
