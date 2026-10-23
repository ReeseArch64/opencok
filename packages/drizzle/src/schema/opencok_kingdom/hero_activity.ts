import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hero_activity = opencok_kingdom.table(
  "hero_activity",
  {
    "uuid": varchar("uuid", { length: 255 }).notNull(),
    "activityId": varchar("activityId", { length: 100 }).notNull(),
    "activityType": integer("activityType"),
    "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
    "roundTime": bigint("roundTime", { mode: "bigint" }).default(sql.raw("0")),
    "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
    "finish": integer("finish").default(sql.raw("0")),
    "alreadyEvent": varchar("alreadyEvent", { length: 1000 }),
    "serverGroup": varchar("serverGroup", { length: 255 }),
    "kingdomRank": varchar("kingdomRank", { length: 255 }),
  },
  (table) => [
    primaryKey({ name: "hero_activity_PRIMARY", columns: [table["uuid"]] }),
    index("hero_activity_st_idx").on(sql.raw('"startTime"')),
    index("hero_activity_et_idx").on(sql.raw('"endTime"')),
    index("hero_activity_act_idx").on(sql.raw('"activityId"')),
  ],
);
