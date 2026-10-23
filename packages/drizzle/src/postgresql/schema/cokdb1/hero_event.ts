// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hero_event = cokdb1.table("hero_event", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "eventId": legacyText("eventId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "activityId": legacyText("activityId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type"),
  "rewardType": integer("rewardType"),
  "readyTime": bigint("readyTime", { mode: "bigint" }).default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastTime": bigint("lastTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardStatus": integer("rewardStatus").default(sql.raw("0")),
  "serverGroup": legacyText("serverGroup", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingdomRank": legacyText("kingdomRank", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "hero_event_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("hero_event_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("hero_event_act_idx").on(sql.raw("rtrim(\"activityId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("hero_event_st_idx").on(sql.raw("\"startTime\"")),
  index("hero_event_et_idx").on(sql.raw("\"endTime\"")),
  index("hero_event_eid_idx").on(sql.raw("rtrim(\"eventId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("hero_event_r_idx").on(sql.raw("\"rewardStatus\"")),
]);
