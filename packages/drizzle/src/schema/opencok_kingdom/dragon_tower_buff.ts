import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_tower_buff = opencok_kingdom.table(
  "dragon_tower_buff",
  {
    "uid": varchar("uid", { length: 32 }).notNull(),
    "buffid": integer("buffid").notNull(),
    "remainlayers": integer("remainlayers"),
    "buytime": bigint("buytime", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "dragon_tower_buff_PRIMARY", columns: [table["uid"], table["buffid"]] }),
    index("dragon_tower_buff_Index_uid").on(sql.raw('"uid"')),
  ],
);
