import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hero_event = opencok_kingdom.table(
  "hero_event",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "eventId": varchar("eventId", { length: 200 }).notNull(),
    "activityId": varchar("activityId", { length: 255 }).notNull(),
    "type": integer("type"),
    "rewardType": integer("rewardType"),
    "readyTime": bigint("readyTime", { mode: "bigint" }).default(sql.raw("0")),
    "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
    "lastTime": bigint("lastTime", { mode: "bigint" }).default(sql.raw("0")),
    "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
    "rewardStatus": integer("rewardStatus").default(sql.raw("0")),
    "serverGroup": varchar("serverGroup", { length: 255 }),
    "kingdomRank": varchar("kingdomRank", { length: 255 }),
  },
  (table) => [
    primaryKey({ name: "hero_event_PRIMARY", columns: [table["uuid"]] }),
    index("hero_event_act_idx").on(sql.raw('"activityId"')),
    index("hero_event_st_idx").on(sql.raw('"startTime"')),
    index("hero_event_et_idx").on(sql.raw('"endTime"')),
    index("hero_event_eid_idx").on(sql.raw('"eventId"')),
    index("hero_event_r_idx").on(sql.raw('"rewardStatus"')),
  ],
);
