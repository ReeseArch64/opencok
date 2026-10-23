import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const king_time_fight_log = opencok_kingdom.table(
  "king_time_fight_log",
  {
    "uid": varchar("uid", { length: 50 }).notNull(),
    "logtime": bigint("logtime", { mode: "bigint" }),
    "category": integer("category"),
    "humanUid": varchar("humanUid", { length: 255 }),
    "pointId": integer("pointId"),
    "data1": varchar("data1", { length: 255 }),
    "data2": varchar("data2", { length: 255 }),
    "data3": varchar("data3", { length: 255 }),
    "data4": varchar("data4", { length: 255 }),
  },
  (table) => [
    primaryKey({ name: "king_time_fight_log_PRIMARY", columns: [table["uid"]] }),
    index("king_time_fight_log_Index_logtime").on(sql.raw('"logtime"')),
  ],
);
