// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const arena_battle_team = cokdb1.table("arena_battle_team", {
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type"),
  "targetId": integer("targetId"),
  "targetUid": legacyText("targetUid", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetName": legacyText("targetName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetPic": legacyText("targetPic", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetAName": legacyText("targetAName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetAAbbr": legacyText("targetAAbbr", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetAIcon": legacyText("targetAIcon", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "targetType": integer("targetType"),
  "leaderUid": legacyText("leaderUid", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "leaderName": legacyText("leaderName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "leaderId": integer("leaderId"),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "allianceAbbr": legacyText("allianceAbbr", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "allianceIcon": legacyText("allianceIcon", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "maxSoldiers": integer("maxSoldiers"),
  "waitTime": bigint("waitTime", { mode: "bigint" }),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "worldId": integer("worldId"),
  "superTeam": integer("superTeam"),
  "failBackItem": integer("failBackItem"),
});
