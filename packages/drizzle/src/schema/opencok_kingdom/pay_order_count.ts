import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const pay_order_count = opencok_kingdom.table("pay_order_count", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "className": varchar("className", { length: 40 }).notNull(),
  "action": integer("action").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_order_count_PRIMARY", columns: [table["uid"], table["className"]] }),
]);
