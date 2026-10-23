import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const activity_new = cokdb1.table("activity_new", {
  "type": varchar("type", { length: 11 }).notNull(),
  "activityInfo": varchar("activityInfo", { length: 2000 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "activity_new_PRIMARY", columns: [table["type"]] }),
]);
