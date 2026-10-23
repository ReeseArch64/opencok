import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const exchange_order = cokdb1.table("exchange_order", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "itemId": varchar("itemId", { length: 40 }).notNull(),
}, (table) => [
  primaryKey({ name: "exchange_order_PRIMARY", columns: [table["uid"]] }),
]);
