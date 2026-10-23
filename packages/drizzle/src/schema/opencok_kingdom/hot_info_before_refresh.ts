import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const hot_info_before_refresh = opencok_kingdom.table(
  "hot_info_before_refresh",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "goodsId": varchar("goodsId", { length: 20 }).notNull(),
    "itemId": varchar("itemId", { length: 20 }),
    "priceType": integer("priceType"),
    "price": integer("price").notNull(),
    "num": integer("num"),
    "refreshTime": bigint("refreshTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "gold": integer("gold").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({
      name: "hot_info_before_refresh_PRIMARY",
      columns: [table["uid"], table["goodsId"], table["price"], table["refreshTime"]],
    }),
    index("hot_info_before_refresh_time_idx").on(sql.raw('"refreshTime"')),
  ],
);
