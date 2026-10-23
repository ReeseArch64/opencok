import { sql } from "drizzle-orm";
import { check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_hot_item_best_v3 = opencok_kingdom.table(
  "user_hot_item_best_v3",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "goodsId": varchar("goodsId", { length: 20 }).notNull(),
    "color": smallint("color"),
    "price_type": integer("price_type"),
    "price": integer("price"),
    "price_hot": integer("price_hot"),
  },
  (table) => [
    primaryKey({ name: "user_hot_item_best_v3_PRIMARY", columns: [table["uid"]] }),
    check("user_hot_item_best_v3_color_range", sql.raw('"color" BETWEEN -128 AND 127')),
  ],
);
