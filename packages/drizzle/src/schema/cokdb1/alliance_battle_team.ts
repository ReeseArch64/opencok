import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const alliance_battle_team = cokdb1.table("alliance_battle_team", {
  "id": varchar("id", { length: 40 }).notNull(),
  "type": integer("type").notNull(),
  "targetId": integer("targetId").notNull(),
  "targetUid": varchar("targetUid", { length: 40 }),
  "targetName": varchar("targetName", { length: 255 }),
  "targetPic": varchar("targetPic", { length: 40 }),
  "targetAName": varchar("targetAName", { length: 40 }),
  "targetAAbbr": varchar("targetAAbbr", { length: 40 }),
  "targetAIcon": varchar("targetAIcon", { length: 40 }),
  "targetType": integer("targetType").default(sql.raw("0")),
  "leaderUid": varchar("leaderUid", { length: 40 }).notNull(),
  "leaderName": varchar("leaderName", { length: 40 }).notNull(),
  "leaderId": integer("leaderId"),
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "allianceName": varchar("allianceName", { length: 40 }),
  "allianceAbbr": varchar("allianceAbbr", { length: 40 }),
  "allianceIcon": varchar("allianceIcon", { length: 40 }),
  "maxSoldiers": integer("maxSoldiers").notNull(),
  "waitTime": bigint("waitTime", { mode: "bigint" }).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "worldId": integer("worldId").notNull().default(sql.raw("0")),
  "failBackItem": integer("failBackItem").default(sql.raw("0")),
  "superTeam": integer("superTeam").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_battle_team_PRIMARY", columns: [table["id"]] }),
]);
