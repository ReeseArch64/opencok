import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hero_event_reward_record = opencok_kingdom.table(
  "hero_event_reward_record",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "allianceId": varchar("allianceId", { length: 255 }).notNull().default(sql.raw("''")),
    "eventId": varchar("eventId", { length: 255 }).notNull(),
    "rank": integer("rank"),
    "level": integer("level").default(sql.raw("0")),
    "rewardId": varchar("rewardId", { length: 255 }),
    "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "hero_event_reward_record_PRIMARY",
      columns: [table["uid"], table["allianceId"], table["eventId"]],
    }),
    index("hero_event_reward_record_eid_idx").on(sql.raw('"eventId"')),
    index("hero_event_reward_record_time_idx").on(sql.raw('"time"')),
    index("hero_event_reward_record_level_idx").on(sql.raw('"level"')),
    index("hero_event_reward_record_al_idx").on(sql.raw('"allianceId"')),
  ],
);
