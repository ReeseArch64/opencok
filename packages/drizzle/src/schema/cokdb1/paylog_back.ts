import { sql } from "drizzle-orm";
import { bigint, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const paylog_back = cokdb1.table("paylog_back", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "orderId": varchar("orderId", { length: 40 }).notNull(),
  "productId": varchar("productId", { length: 10 }).notNull().default(sql.raw("'0'")),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": numeric("spend", { precision: 10, scale: 0, mode: "number" }).notNull().default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
}, (table) => [
  primaryKey({ name: "paylog_back_PRIMARY", columns: [table["uid"], table["orderId"]] }),
]);
