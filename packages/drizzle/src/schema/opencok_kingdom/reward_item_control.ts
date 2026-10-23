import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const reward_item_control = opencok_kingdom.table("reward_item_control", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 255 }).notNull(),
  "count": integer("count").notNull().default(sql.raw("0")),
  "flushTime": bigint("flushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "reward_item_control_PRIMARY", columns: [table["uid"], table["itemId"]] }),
]);
