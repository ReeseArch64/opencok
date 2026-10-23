import { varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const exchange = cokdb_global.table("exchange", {
  "orderId": varchar("orderId", { length: 200 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
});
