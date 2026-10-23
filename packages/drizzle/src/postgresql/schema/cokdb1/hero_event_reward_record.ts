// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hero_event_reward_record = cokdb1.table("hero_event_reward_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(255)","collation":"C"}).notNull().default(sql.raw("''")),
  "eventId": legacyText("eventId", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "rank": integer("rank"),
  "level": integer("level").default(sql.raw("0")),
  "rewardId": legacyText("rewardId", {"sqlType":"character varying(255)","collation":"C"}),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "hero_event_reward_record_PRIMARY", columns: [table["uid"], table["allianceId"], table["eventId"]] }),
  uniqueIndex("hero_event_reward_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"eventId\", ' ') COLLATE \"C\"")),
  index("hero_event_reward_record_eid_idx").on(sql.raw("rtrim(\"eventId\", ' ') COLLATE \"C\"")),
  index("hero_event_reward_record_time_idx").on(sql.raw("\"time\"")),
  index("hero_event_reward_record_level_idx").on(sql.raw("\"level\"")),
  index("hero_event_reward_record_al_idx").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\"")),
]);
