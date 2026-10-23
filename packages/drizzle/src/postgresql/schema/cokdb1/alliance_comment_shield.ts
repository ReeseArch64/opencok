// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_comment_shield = cokdb1.table("alliance_comment_shield", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "type": integer("type"),
  "icon": legacyText("icon", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "abbr": legacyText("abbr", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_comment_shield_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_comment_shield_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_comment_shield_index_allianceId").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
