import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_civilization_science = cokdb1.table("user_civilization_science", {
  "baseItemID": integer("baseItemID").notNull(),
  "userID": varchar("userID", { length: 64 }).notNull(),
  "level": integer("level"),
}, (table) => [
  primaryKey({ name: "user_civilization_science_PRIMARY", columns: [table["baseItemID"], table["userID"]] }),
]);
