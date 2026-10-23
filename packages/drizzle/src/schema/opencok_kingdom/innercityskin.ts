import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const innercityskin = opencok_kingdom.table("innercityskin", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "style": varchar("style", { length: 255 }).default(sql.raw("'-1'")),
  "zoom": varchar("zoom", { length: 255 }).default(sql.raw("''")),
  "show_type": varchar("show_type", { length: 255 }).default(sql.raw("'-1'")),
  "time": varchar("time", { length: 255 }),
}, (table) => [
  primaryKey({ name: "innercityskin_PRIMARY", columns: [table["uid"]] }),
]);
