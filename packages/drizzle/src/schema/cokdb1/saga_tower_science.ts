import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const saga_tower_science = cokdb1.table("saga_tower_science", {
  "uid": varchar("uid", { length: 32 }).notNull(),
  "itemid": integer("itemid").notNull(),
  "level": integer("level"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "reserve": integer("reserve"),
}, (table) => [
  primaryKey({ name: "saga_tower_science_PRIMARY", columns: [table["uid"], table["itemid"]] }),
]);
