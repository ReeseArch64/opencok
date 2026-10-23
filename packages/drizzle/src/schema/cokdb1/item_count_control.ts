import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const item_count_control = cokdb1.table("item_count_control", {
  "itemId": varchar("itemId", { length: 50 }).notNull(),
  "count": integer("count"),
  "total": integer("total"),
  "total2": integer("total2"),
  "lastRefreshTime": bigint("lastRefreshTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "item_count_control_PRIMARY", columns: [table["itemId"]] }),
]);
