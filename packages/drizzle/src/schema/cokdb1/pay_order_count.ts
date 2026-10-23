import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const pay_order_count = cokdb1.table("pay_order_count", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "className": varchar("className", { length: 40 }).notNull(),
  "action": integer("action").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_order_count_PRIMARY", columns: [table["uid"], table["className"]] }),
]);
