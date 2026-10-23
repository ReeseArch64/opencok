import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const oldmailinsert = opencok_kingdom.table("oldmailinsert", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "oldmailinsert_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
