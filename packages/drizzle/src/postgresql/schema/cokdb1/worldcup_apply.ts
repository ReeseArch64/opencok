// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const worldcup_apply = cokdb1.table("worldcup_apply", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "version": integer("version").notNull(),
  "applyUid": legacyText("applyUid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "serverId": integer("serverId"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "worldcup_apply_PRIMARY", columns: [table["allianceId"], table["version"]] }),
  uniqueIndex("worldcup_apply_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"version\"")),
]);
