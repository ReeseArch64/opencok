import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const methods = opencok_kingdom.table(
    "methods",
    {
        "method_id": integer("method_id").notNull(),
        "route_id": integer("route_id"),
        "method_name": varchar("method_name", { length: 50 }),
        "method_path": varchar("method_path", { length: 50 }),
    },
    (table) => [primaryKey({ name: "methods_PRIMARY", columns: [table["method_id"]] })],
);
