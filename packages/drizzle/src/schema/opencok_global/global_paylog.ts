import { sql } from "drizzle-orm";
import { bigint, check, index, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const global_paylog = opencok_global.table("global_paylog", {
  "sid": integer("sid").notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "orderId": varchar("orderId", { length: 200 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
  "productId": varchar("productId", { length: 10 }).notNull().default(sql.raw("'0'")),
  "orderInfo": varchar("orderInfo", { length: 200 }),
  "orderParam": bytea("orderParam"),
  "time": bigint("time", { mode: "bigint" }),
  "currency": integer("currency").default(sql.raw("0")),
  "spend": numeric("spend", { precision: 10, scale: 2, mode: "number" }).notNull().default(sql.raw("0.00")),
  "paid": numeric("paid", { precision: 10, scale: 2, mode: "number" }).default(sql.raw("0.00")),
  "status": integer("status").default(sql.raw("0")),
  "payLevel": integer("payLevel").notNull(),
  "buildingLv": integer("buildingLv"),
  "receiverId": varchar("receiverId", { length: 40 }),
  "deviceId": varchar("deviceId", { length: 255 }),
  "ip": varchar("ip", { length: 20 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "global_paylog_PRIMARY", columns: [table["sid"], table["uid"], table["orderId"], table["pf"]] }),
  index("global_paylog_ipAndTime").on(sql.raw("\"ip\""), sql.raw("\"time\"")),
  check("global_paylog_orderParam_length", sql.raw("octet_length(\"orderParam\") <= 65535")),
]);
