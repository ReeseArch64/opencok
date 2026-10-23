import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const arena_battle_team = cokdb1.table("arena_battle_team", {
  "id": varchar("id", { length: 255 }).notNull(),
  "type": integer("type"),
  "targetId": integer("targetId"),
  "targetUid": varchar("targetUid", { length: 200 }),
  "targetName": varchar("targetName", { length: 200 }),
  "targetPic": varchar("targetPic", { length: 200 }),
  "targetAName": varchar("targetAName", { length: 200 }),
  "targetAAbbr": varchar("targetAAbbr", { length: 200 }),
  "targetAIcon": varchar("targetAIcon", { length: 200 }),
  "targetType": integer("targetType"),
  "leaderUid": varchar("leaderUid", { length: 200 }),
  "leaderName": varchar("leaderName", { length: 200 }),
  "leaderId": integer("leaderId"),
  "allianceId": varchar("allianceId", { length: 200 }),
  "allianceName": varchar("allianceName", { length: 200 }),
  "allianceAbbr": varchar("allianceAbbr", { length: 200 }),
  "allianceIcon": varchar("allianceIcon", { length: 200 }),
  "maxSoldiers": integer("maxSoldiers"),
  "waitTime": bigint("waitTime", { mode: "bigint" }),
  "createTime": bigint("createTime", { mode: "bigint" }),
  "worldId": integer("worldId"),
  "superTeam": integer("superTeam"),
  "failBackItem": integer("failBackItem"),
});
