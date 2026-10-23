import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_honor = cokdb1.table("user_honor", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "id": varchar("id", { length: 50 }).notNull().default(sql.raw("''")),
  "level": integer("level"),
}, (table) => [
  primaryKey({ name: "user_honor_PRIMARY", columns: [table["uid"], table["id"]] }),
]);
