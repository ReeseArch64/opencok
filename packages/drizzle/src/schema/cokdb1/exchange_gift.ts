import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const exchange_gift = cokdb1.table("exchange_gift", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "receiverId": varchar("receiverId", { length: 40 }).notNull(),
  "exchangeId": varchar("exchangeId", { length: 20 }).notNull(),
  "sendTime": bigint("sendTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_gift_PRIMARY", columns: [table["uid"], table["receiverId"], table["exchangeId"]] }),
]);
