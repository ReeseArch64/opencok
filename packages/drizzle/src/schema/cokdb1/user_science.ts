import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_science = cokdb1.table("user_science", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": varchar("itemId", { length: 20 }).notNull(),
  "level": integer("level").notNull().default(sql.raw("0")),
  "cd": bigint("cd", { mode: "bigint" }).notNull().default(sql.raw("9223372036854775807")),
}, (table) => [
  primaryKey({ name: "user_science_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  index("user_science_Index_ownerId").on(sql.raw("\"uid\""), sql.raw("\"itemId\"")),
]);
