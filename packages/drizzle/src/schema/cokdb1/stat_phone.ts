import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const stat_phone = cokdb1.table("stat_phone", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "model": varchar("model", { length: 255 }),
  "version": varchar("version", { length: 255 }),
  "width": integer("width"),
  "height": integer("height"),
}, (table) => [
  primaryKey({ name: "stat_phone_PRIMARY", columns: [table["uid"]] }),
]);
