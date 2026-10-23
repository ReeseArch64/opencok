import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const stat_phone = opencok_kingdom.table("stat_phone", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "model": varchar("model", { length: 255 }),
  "version": varchar("version", { length: 255 }),
  "width": integer("width"),
  "height": integer("height"),
}, (table) => [
  primaryKey({ name: "stat_phone_PRIMARY", columns: [table["uid"]] }),
]);
