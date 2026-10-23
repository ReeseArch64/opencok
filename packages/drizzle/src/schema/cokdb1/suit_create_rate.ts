import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const suit_create_rate = cokdb1.table("suit_create_rate", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 40 }).notNull(),
  "rate": integer("rate").notNull(),
}, (table) => [
  primaryKey({ name: "suit_create_rate_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
