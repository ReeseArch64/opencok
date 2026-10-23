import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_hot_item_best = cokdb1.table("user_hot_item_best", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "goodsId": varchar("goodsId", { length: 20 }).notNull(),
  "color": integer("color").default(sql.raw("0")),
  "price_type": integer("price_type").default(sql.raw("0")),
  "price": integer("price").default(sql.raw("0")),
  "price_hot": integer("price_hot").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_hot_item_best_PRIMARY", columns: [table["uid"]] }),
]);
