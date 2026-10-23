import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const staff = opencok_kingdom.table("staff", {
  "id": integer("id").notNull(),
  "name": varchar("name", { length: 255 }).notNull(),
}, (table) => [
  primaryKey({ name: "staff_PRIMARY", columns: [table["id"]] }),
]);
