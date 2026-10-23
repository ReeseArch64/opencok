import { sql } from "drizzle-orm";
import { bigint, check, index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const paylog = opencok_kingdom.table("paylog", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "orderId": varchar("orderId", { length: 200 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
  "productId": varchar("productId", { length: 10 }).notNull().default(sql.raw("'0'")),
  "orderInfo": varchar("orderInfo", { length: 200 }),
  "orderParam": bytea("orderParam"),
  "comments": varchar("comments", { length: 100 }),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": numeric("spend", { precision: 10, scale: 2, mode: "number" }).notNull().default(sql.raw("0.00")),
  "paid": numeric("paid", { precision: 10, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
  "buildingLv": integer("buildingLv").default(sql.raw("0")),
  "receiverId": varchar("receiverId", { length: 40 }),
  "deviceId": varchar("deviceId", { length: 255 }),
  "ip": varchar("ip", { length: 20 }).default(sql.raw("''")),
  "curGaid": varchar("curGaid", { length: 40 }),
  "truelyIp": varchar("truelyIp", { length: 20 }),
  "optionId": varchar("optionId", { length: 100 }),
}, (table) => [
  primaryKey({ name: "paylog_PRIMARY", columns: [table["uid"], table["orderId"], table["pf"]] }),
  index("paylog_index_time_pf").on(sql.raw("\"time\""), sql.raw("\"pf\"")),
  check("paylog_orderParam_length", sql.raw("octet_length(\"orderParam\") <= 65535")),
]);
