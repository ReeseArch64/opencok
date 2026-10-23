import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const foreigen_sciences = cokdb1.table("foreigen_sciences", {
  "uid": varchar("uid", { length: 32 }).notNull(),
  "itemid": integer("itemid").notNull(),
  "level": integer("level"),
  "cdtime": bigint("cdtime", { mode: "bigint" }),
  "reserve": integer("reserve"),
}, (table) => [
  primaryKey({ name: "foreigen_sciences_PRIMARY", columns: [table["uid"], table["itemid"]] }),
]);
