import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_used_item = opencok_kingdom.table("user_used_item", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 40 }).notNull(),
}, (table) => [
  primaryKey({ name: "user_used_item_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
