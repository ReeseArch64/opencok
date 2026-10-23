import { sql } from "drizzle-orm";
import { integer, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const activation_bak = opencok_global.table("activation_bak", {
  "code": varchar("code", { length: 40 }).notNull(),
  "series": integer("series"),
  "user": varchar("user", { length: 40 }),
  "state": integer("state").default(sql.raw("0")),
});
