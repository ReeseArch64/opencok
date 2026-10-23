import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const activity_new = opencok_kingdom.table("activity_new", {
  "type": varchar("type", { length: 11 }).notNull(),
  "activityInfo": varchar("activityInfo", { length: 2000 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "activity_new_PRIMARY", columns: [table["type"]] }),
]);
