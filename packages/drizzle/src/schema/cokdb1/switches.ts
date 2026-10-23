import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const switches = cokdb1.table("switches", {
  "name": varchar("name", { length: 255 }).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "appVersion": varchar("appVersion", { length: 255 }),
}, (table) => [
  primaryKey({ name: "switches_PRIMARY", columns: [table["name"]] }),
]);
