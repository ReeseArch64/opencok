import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const role_permission = opencok_kingdom.table(
    "role_permission",
    {
        "role_id": integer("role_id").notNull(),
        "module_permission": varchar("module_permission", { length: 255 }).notNull(),
        "route_permission": varchar("route_permission", { length: 1000 }),
        "method_permission": varchar("method_permission", { length: 1000 }),
    },
    (table) => [
        primaryKey({
            name: "role_permission_PRIMARY",
            columns: [table["role_id"], table["module_permission"]],
        }),
    ],
);
