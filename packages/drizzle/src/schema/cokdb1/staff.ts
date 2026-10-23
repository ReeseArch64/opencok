import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const staff = cokdb1.table("staff", {
  "id": integer("id").notNull(),
  "name": varchar("name", { length: 255 }).notNull(),
}, (table) => [
  primaryKey({ name: "staff_PRIMARY", columns: [table["id"]] }),
]);
