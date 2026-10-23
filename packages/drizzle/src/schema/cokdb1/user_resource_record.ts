import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_resource_record = cokdb1.table("user_resource_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 255 }).notNull(),
  "wood": bigint("wood", { mode: "bigint" }),
  "stone": bigint("stone", { mode: "bigint" }),
  "iron": bigint("iron", { mode: "bigint" }),
  "food": bigint("food", { mode: "bigint" }),
  "wood_bind": bigint("wood_bind", { mode: "bigint" }),
  "stone_bind": bigint("stone_bind", { mode: "bigint" }),
  "iron_bind": bigint("iron_bind", { mode: "bigint" }),
  "food_bind": bigint("food_bind", { mode: "bigint" }),
  "costItem": varchar("costItem", { length: 255 }),
}, (table) => [
  primaryKey({ name: "user_resource_record_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  index("user_resource_record_uid_idx").on(sql.raw("\"uid\"")),
  index("user_resource_record_item_idx").on(sql.raw("\"itemId\"")),
]);
