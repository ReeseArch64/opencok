import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_resource_bind = opencok_kingdom.table("user_resource_bind", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "wood": integer("wood"),
  "food": integer("food"),
  "stone": integer("stone"),
  "iron": integer("iron"),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "user_resource_bind_PRIMARY", columns: [table["uid"]] }),
]);
