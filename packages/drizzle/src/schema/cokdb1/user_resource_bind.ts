import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_resource_bind = cokdb1.table("user_resource_bind", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "wood": integer("wood"),
  "food": integer("food"),
  "stone": integer("stone"),
  "iron": integer("iron"),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "user_resource_bind_PRIMARY", columns: [table["uid"]] }),
]);
