import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_item_cd = cokdb1.table("user_item_cd", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 255 }).notNull(),
  "useTime": bigint("useTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_item_cd_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
