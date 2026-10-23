import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_mission_record = opencok_kingdom.table("alliance_mission_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "missionUUID": varchar("missionUUID", { length: 255 }).notNull(),
  "allianceId": varchar("allianceId", { length: 255 }),
  "mType": integer("mType"),
  "rewardFlag": varchar("rewardFlag", { length: 100 }),
}, (table) => [
  primaryKey({ name: "alliance_mission_record_PRIMARY", columns: [table["uid"], table["missionUUID"]] }),
  index("alliance_mission_record_uid_idx").on(sql.raw("\"uid\"")),
  index("alliance_mission_record_mid_idx").on(sql.raw("\"missionUUID\"")),
  index("alliance_mission_record_allianceId").on(sql.raw("\"allianceId\"")),
]);
