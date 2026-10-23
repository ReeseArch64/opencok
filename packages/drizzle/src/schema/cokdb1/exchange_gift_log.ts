import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const exchange_gift_log = cokdb1.table("exchange_gift_log", {
  "mailId": varchar("mailId", { length: 40 }).notNull(),
  "senderId": varchar("senderId", { length: 40 }),
  "receiverId": varchar("receiverId", { length: 40 }),
  "exchangeId": varchar("exchangeId", { length: 20 }),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
  "status": smallint("status"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_gift_log_PRIMARY", columns: [table["mailId"], table["sendTime"]] }),
  check("exchange_gift_log_status_range", sql.raw("\"status\" BETWEEN -128 AND 127")),
]);
