// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_blacklist = cokdb1.table("alliance_blacklist", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "black": legacyText("black", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
  "white": legacyText("white", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_blacklist_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("alliance_blacklist_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
