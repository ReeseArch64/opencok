import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const pay_request = cokdb1.table("pay_request", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "optionId": integer("optionId"),
  "purchaseId": varchar("purchaseId", { length: 10 }).default(sql.raw("''")),
  "productId": varchar("productId", { length: 10 }).default(sql.raw("''")),
  "status": integer("status").default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "pay_request_PRIMARY", columns: [table["uid"], table["pf"], table["time"]] }),
  index("pay_request_index_uid_pf_purchaseId").on(sql.raw("\"uid\""), sql.raw("\"pf\""), sql.raw("\"purchaseId\"")),
  index("pay_request_index_uid_pf_productId").on(sql.raw("\"uid\""), sql.raw("\"pf\""), sql.raw("\"productId\"")),
]);
