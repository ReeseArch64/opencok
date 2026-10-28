import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const badwords = opencok_kingdom.table(
    "badwords",
    {
        "id": bigint("id", { mode: "bigint" })
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "badwords_id_seq", "startWith": 1 }),
        "words": varchar("words", { length: 255 }),
    },
    (table) => [primaryKey({ name: "badwords_PRIMARY", columns: [table["id"]] })],
);
