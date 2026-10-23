import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_gold_group_buy = opencok_kingdom.table("user_gold_group_buy", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 40 }).notNull(),
  "buy_time": bigint("buy_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "discount": integer("discount").notNull().default(sql.raw("0")),
  "group_coupon_num": integer("group_coupon_num").notNull().default(sql.raw("0")),
  "isMail": integer("isMail").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_gold_group_buy_PRIMARY", columns: [table["uid"], table["id"], table["buy_time"]] }),
]);
