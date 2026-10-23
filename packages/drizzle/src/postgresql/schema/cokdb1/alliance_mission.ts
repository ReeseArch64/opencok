// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_mission = cokdb1.table("alliance_mission", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "missionId": legacyText("missionId", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "mType": integer("mType"),
  "triggerType": integer("triggerType"),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "conditionValue": legacyText("conditionValue", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "para": legacyText("para", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "rewardFlag": legacyText("rewardFlag", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "rewardId": legacyText("rewardId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "currentValue": bigint("currentValue", { mode: "bigint" }),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "alliance_mission_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("alliance_mission_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("alliance_mission_aid_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
