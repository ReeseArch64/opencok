import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_weakness_building = cokdb1.table("user_weakness_building", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "armyId": varchar("armyId", { length: 20 }).notNull(),
  "weakness": integer("weakness").notNull().default(sql.raw("0")),
  "marchWeakness": integer("marchWeakness").notNull(),
  "heal": integer("heal").notNull().default(sql.raw("0")),
  "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_weakness_building_PRIMARY", columns: [table["uid"], table["armyId"]] }),
]);
