// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_cross_throne = cokdb1.table("user_cross_throne", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "user_cross_throne_id_seq", startWith: 2347 }),
  "uid": legacyText("uid", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "totalKills": bigint("totalKills", { mode: "bigint" }).default(sql.raw("0")),
  "totalDeads": bigint("totalDeads", { mode: "bigint" }),
  "kingdomFightIndex": integer("kingdomFightIndex"),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "name": legacyText("name", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "abbr": legacyText("abbr", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "kingdomName": legacyText("kingdomName", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "serverId": integer("serverId"),
  "deadDetail": legacyText("deadDetail", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "deadDetailBak": legacyText("deadDetailBak", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
  "hasCemeteryCollected": bigint("hasCemeteryCollected", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_cross_throne_PRIMARY", columns: [table["id"]] }),
]);
