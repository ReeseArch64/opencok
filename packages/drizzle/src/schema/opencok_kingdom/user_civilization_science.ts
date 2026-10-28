import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_civilization_science = opencok_kingdom.table(
    "user_civilization_science",
    {
        "baseItemID": integer("baseItemID").notNull(),
        "userID": varchar("userID", { length: 64 }).notNull(),
        "level": integer("level"),
    },
    (table) => [
        primaryKey({
            name: "user_civilization_science_PRIMARY",
            columns: [table["baseItemID"], table["userID"]],
        }),
    ],
);
