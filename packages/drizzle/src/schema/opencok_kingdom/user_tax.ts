import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_tax = opencok_kingdom.table("user_tax", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "wood": bigint("wood", { mode: "bigint" }).notNull(),
  "food": bigint("food", { mode: "bigint" }).notNull(),
  "iron": bigint("iron", { mode: "bigint" }).notNull(),
  "stone": bigint("stone", { mode: "bigint" }).notNull(),
  "silver": bigint("silver", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_tax_PRIMARY", columns: [table["uid"]] }),
]);
