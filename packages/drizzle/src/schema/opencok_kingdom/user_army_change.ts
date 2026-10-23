import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_army_change = opencok_kingdom.table("user_army_change", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "armyId": varchar("armyId", { length: 20 }).notNull(),
  "level": integer("level").notNull().default(sql.raw("0")),
  "free": integer("free").notNull().default(sql.raw("0")),
  "pve": integer("pve").notNull().default(sql.raw("0")),
  "march": integer("march").notNull().default(sql.raw("0")),
  "defence": integer("defence").notNull().default(sql.raw("0")),
  "train": integer("train").notNull().default(sql.raw("0")),
  "foodCostTime": bigint("foodCostTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_army_change_PRIMARY", columns: [table["uid"], table["armyId"]] }),
]);
