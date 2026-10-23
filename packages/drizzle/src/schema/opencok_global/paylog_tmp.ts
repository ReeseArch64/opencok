import { sql } from "drizzle-orm";
import { bigint, index, integer, numeric, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const paylog_tmp = opencok_global.table(
  "paylog_tmp",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "orderId": varchar("orderId", { length: 200 }).notNull(),
    "pf": varchar("pf", { length: 20 }).notNull(),
    "productId": varchar("productId", { length: 10 }).notNull().default(sql.raw("'0'")),
    "orderInfo": varchar("orderInfo", { length: 100 }).default(sql.raw("''")),
    "time": bigint("time", { mode: "bigint" }),
    "currency": integer("currency").default(sql.raw("0")),
    "spend": numeric("spend", { precision: 10, scale: 2, mode: "number" })
      .notNull()
      .default(sql.raw("0.00")),
    "paid": numeric("paid", { precision: 10, scale: 2, mode: "number" }).default(sql.raw("0.00")),
    "status": integer("status").default(sql.raw("0")),
    "payLevel": integer("payLevel").notNull(),
    "buildingLv": integer("buildingLv").default(sql.raw("0")),
  },
  (_table) => [
    index("paylog_tmp_index_time_pf").on(sql.raw('"uid"'), sql.raw('"orderId"'), sql.raw('"time"')),
  ],
);
