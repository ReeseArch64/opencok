// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_mission_record = cokdb1.table("alliance_mission_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "missionUUID": legacyText("missionUUID", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "mType": integer("mType"),
  "rewardFlag": legacyText("rewardFlag", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_mission_record_PRIMARY", columns: [table["uid"], table["missionUUID"]] }),
  uniqueIndex("alliance_mission_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"missionUUID\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_mission_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_mission_record_mid_idx").on(sql.raw("rtrim(\"missionUUID\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_mission_record_allianceId").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
