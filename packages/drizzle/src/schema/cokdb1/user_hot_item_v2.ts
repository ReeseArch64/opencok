import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_hot_item_v2 = cokdb1.table("user_hot_item_v2", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "goodsId": varchar("goodsId", { length: 20 }).notNull(),
  "itemId": varchar("itemId", { length: 20 }),
  "priceType": integer("priceType"),
  "price": integer("price").notNull(),
  "price_hot": integer("price_hot").default(sql.raw("0")),
  "num": integer("num"),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }),
  "para1": integer("para1").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_hot_item_v2_PRIMARY", columns: [table["uid"], table["goodsId"], table["price"]] }),
]);
