import { varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const exchange = opencok_global.table("exchange", {
  "orderId": varchar("orderId", { length: 200 }).notNull(),
  "pf": varchar("pf", { length: 20 }).notNull(),
});
