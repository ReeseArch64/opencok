import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_mission = opencok_kingdom.table("alliance_mission", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "missionId": varchar("missionId", { length: 50 }).notNull(),
  "mType": integer("mType"),
  "triggerType": integer("triggerType"),
  "allianceId": varchar("allianceId", { length: 255 }),
  "conditionValue": varchar("conditionValue", { length: 100 }),
  "para": varchar("para", { length: 100 }),
  "rewardFlag": varchar("rewardFlag", { length: 100 }),
  "rewardId": varchar("rewardId", { length: 100 }),
  "currentValue": bigint("currentValue", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_mission_PRIMARY", columns: [table["uuid"]] }),
  index("alliance_mission_aid_idx").on(sql.raw("\"allianceId\"")),
]);
