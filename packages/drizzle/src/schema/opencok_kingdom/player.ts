import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const player = opencok_kingdom.table(
    "player",
    {
        "id": varchar("id", { length: 8 }).notNull(),
        "name": varchar("name", { length: 255 }).notNull(),
    },
    (table) => [primaryKey({ name: "player_PRIMARY", columns: [table["id"]] })],
);
