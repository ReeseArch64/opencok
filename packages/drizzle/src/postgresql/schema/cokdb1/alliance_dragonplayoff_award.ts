// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_dragonplayoff_award = cokdb1.table("alliance_dragonplayoff_award", {
  "version": integer("version").notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "state": integer("state").notNull(),
  "addr": legacyText("addr", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_dragonplayoff_award_PRIMARY", columns: [table["version"], table["allianceId"], table["uid"], table["type"]] }),
  uniqueIndex("alliance_dragonplayoff_award_PRIMARY_pad").on(sql.raw("\"version\""), sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
