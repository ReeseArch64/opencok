import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_item = cokdb1.table("user_item", {
  "uuid": varchar("uuid", { length: 40 }).notNull(),
  "ownerId": varchar("ownerId", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 255 }).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "value": integer("value"),
  "vanishTime": bigint("vanishTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_item_PRIMARY", columns: [table["uuid"]] }),
  index("user_item_uitem_ownerId_index").on(sql.raw("\"ownerId\""), sql.raw("\"itemId\""), sql.raw("\"value\"")),
]);
