import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const switches = opencok_kingdom.table(
  "switches",
  {
    "name": varchar("name", { length: 255 }).notNull(),
    "stat": integer("stat").default(sql.raw("0")),
    "appVersion": varchar("appVersion", { length: 255 }),
  },
  (table) => [primaryKey({ name: "switches_PRIMARY", columns: [table["name"]] })],
);
