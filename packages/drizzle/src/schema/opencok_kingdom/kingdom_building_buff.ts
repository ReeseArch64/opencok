import { sql } from "drizzle-orm";
import { bigint, doublePrecision, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const kingdom_building_buff = opencok_kingdom.table(
  "kingdom_building_buff",
  {
    "uuid": varchar("uuid", { length: 36 }).notNull(),
    "effect": integer("effect").notNull(),
    "value": doublePrecision("value"),
    "expiretime": bigint("expiretime", { mode: "bigint" }),
    "reserve": bigint("reserve", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({
      name: "kingdom_building_buff_PRIMARY",
      columns: [table["uuid"], table["effect"]],
    }),
    index("kingdom_building_buff_Index_itemid").on(sql.raw('"uuid"')),
  ],
);
