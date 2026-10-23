import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const oldmailinsert = cokdb1.table("oldmailinsert", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "oldmailinsert_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
