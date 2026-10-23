import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_resource_bak = opencok_kingdom.table("user_resource_bak", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "stone": integer("stone").notNull(),
  "wood": integer("wood").notNull(),
  "iron": integer("iron").notNull(),
  "food": integer("food").notNull(),
  "silver": integer("silver").notNull(),
  "chip": integer("chip").notNull(),
  "diamond": integer("diamond").notNull(),
  "dragon_food": integer("dragon_food").notNull(),
  "dragon_gold": integer("dragon_gold").notNull(),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).notNull(),
  "woodbind": bigint("woodbind", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "stonebind": bigint("stonebind", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "ironbind": bigint("ironbind", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "foodbind": bigint("foodbind", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_resource_bak_PRIMARY", columns: [table["uid"]] }),
]);
