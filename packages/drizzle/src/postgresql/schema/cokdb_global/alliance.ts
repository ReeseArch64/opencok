// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const alliance = cokdb_global.table("alliance", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "alliancename": legacyText("alliancename", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "serverId": integer("serverId"),
}, (table) => [
  primaryKey({ name: "alliance_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("alliance_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_alliancename_index").on(sql.raw("rtrim(\"alliancename\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_name_idx").on(sql.raw("rtrim(\"alliancename\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
