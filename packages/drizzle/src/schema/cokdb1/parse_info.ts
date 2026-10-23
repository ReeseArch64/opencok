import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const parse_info = cokdb1.table("parse_info", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull(),
  "status": integer("status").notNull(),
  "audio": integer("audio").notNull().default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "parse_info_PRIMARY", columns: [table["uid"], table["type"]] }),
]);
