import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_used_item = cokdb1.table("user_used_item", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 40 }).notNull(),
}, (table) => [
  primaryKey({ name: "user_used_item_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
