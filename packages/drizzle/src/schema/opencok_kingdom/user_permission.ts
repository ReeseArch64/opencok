import { integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_permission = opencok_kingdom.table("user_permission", {
  "user_id": integer("user_id").notNull(),
  "module_permission": varchar("module_permission", { length: 255 }).notNull(),
  "route_permission": varchar("route_permission", { length: 1000 }),
  "method_permission": varchar("method_permission", { length: 1000 }),
  "type": smallint("type").notNull(),
}, (table) => [
  primaryKey({ name: "user_permission_PRIMARY", columns: [table["user_id"], table["module_permission"], table["type"]] }),
]);
