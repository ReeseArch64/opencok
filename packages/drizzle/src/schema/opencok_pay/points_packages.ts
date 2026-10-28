import { integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const points_packages = opencok_pay.table(
    "points_packages",
    {
        "id": integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "points_packages_id_seq", "startWith": 2 }),
        "name": varchar("name", { length: 255 }).notNull(),
        "points": integer("points").notNull(),
        "price": numeric("price", { precision: 10, scale: 2, mode: "string" }).notNull(),
    },
    (table) => [primaryKey({ name: "points_packages_PRIMARY", columns: [table["id"]] })],
);
