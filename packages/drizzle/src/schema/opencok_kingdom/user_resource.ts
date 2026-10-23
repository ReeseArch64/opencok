import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_resource = opencok_kingdom.table(
  "user_resource",
  {
    "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
    "stone": bigint("stone", { mode: "bigint" }).notNull(),
    "wood": bigint("wood", { mode: "bigint" }).notNull(),
    "iron": bigint("iron", { mode: "bigint" }).notNull(),
    "food": bigint("food", { mode: "bigint" }).notNull(),
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
    "sandstone": integer("sandstone").default(sql.raw("0")),
    "diamondstone": integer("diamondstone").default(sql.raw("0")),
    "marble": integer("marble").default(sql.raw("0")),
    "granite": integer("granite").default(sql.raw("0")),
    "limestone": integer("limestone").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "user_resource_PRIMARY", columns: [table["uid"]] })],
);
