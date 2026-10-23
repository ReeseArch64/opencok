import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const exchange_time = cokdb1.table("exchange_time", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 40 }).notNull(),
  "beginTime": bigint("beginTime", { mode: "bigint" }),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exchange_time_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
