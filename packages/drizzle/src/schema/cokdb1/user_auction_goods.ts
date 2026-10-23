import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_auction_goods = cokdb1.table("user_auction_goods", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "gold": integer("gold"),
}, (table) => [
  primaryKey({ name: "user_auction_goods_PRIMARY", columns: [table["uid"], table["uuid"]] }),
  index("user_auction_goods_key_user_auction_goods_uid").on(sql.raw("\"uid\"")),
]);
