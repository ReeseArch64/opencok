// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_battle_team = cokdb1.table("kingdom_battle_team", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull(),
  "targetId": integer("targetId").notNull(),
  "targetUid": legacyText("targetUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetName": legacyText("targetName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "targetPic": legacyText("targetPic", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetAName": legacyText("targetAName", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetAAbbr": legacyText("targetAAbbr", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetAIcon": legacyText("targetAIcon", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "targetType": integer("targetType").default(sql.raw("0")),
  "leaderUid": legacyText("leaderUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "leaderName": legacyText("leaderName", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "leaderId": integer("leaderId"),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceAbbr": legacyText("allianceAbbr", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "allianceIcon": legacyText("allianceIcon", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "maxSoldiers": integer("maxSoldiers").notNull(),
  "waitTime": bigint("waitTime", { mode: "bigint" }).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "worldId": integer("worldId").notNull().default(sql.raw("0")),
  "failBackItem": integer("failBackItem").default(sql.raw("0")),
  "superTeam": integer("superTeam").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_battle_team_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("kingdom_battle_team_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
