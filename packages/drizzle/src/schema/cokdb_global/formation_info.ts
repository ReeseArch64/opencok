import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const formation_info = cokdb_global.table("formation_info", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "formation": varchar("formation", { length: 1024 }),
  "index1": integer("index1").notNull(),
  "customName": varchar("customName", { length: 21 }),
  "dragonFormation": varchar("dragonFormation", { length: 300 }),
  "heroFormation": varchar("heroFormation", { length: 300 }),
  "angelArmy": varchar("angelArmy", { length: 50 }),
}, (table) => [
  primaryKey({ name: "formation_info_PRIMARY", columns: [table["uid"], table["index1"]] }),
]);
