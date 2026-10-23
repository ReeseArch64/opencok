import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_building = opencok_kingdom.table(
  "user_building",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "uid": varchar("uid", { length: 40 }).notNull(),
    "itemId": integer("itemId").notNull(),
    "pos": integer("pos").notNull(),
    "level": integer("level").notNull(),
    "opType": integer("opType").default(sql.raw("0")),
    "putId": varchar("putId", { length: 100 }),
    "reward": integer("reward").default(sql.raw("0")),
    "refreshTime": bigint("refreshTime", { mode: "bigint" }),
    "updateTime": bigint("updateTime", { mode: "bigint" }).default(sql.raw("0")),
    "effectTime": bigint("effectTime", { mode: "bigint" }).default(sql.raw("0")),
    "star": integer("star").default(sql.raw("0")),
    "progress": integer("progress").default(sql.raw("0")),
    "unlockFlag": integer("unlockFlag").notNull().default(sql.raw("0")),
    "costUnlockTimes": integer("costUnlockTimes").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_building_PRIMARY", columns: [table["uuid"]] }),
    index("user_building_ub_uid_index").on(sql.raw('"uid"'), sql.raw('"itemId"')),
    index("user_building_item_index").on(sql.raw('"itemId"')),
    index("user_building_itemId_level_index").on(sql.raw('"itemId"'), sql.raw('"level"')),
    index("user_building_itemId_star_index").on(sql.raw('"itemId"'), sql.raw('"star"')),
  ],
);
