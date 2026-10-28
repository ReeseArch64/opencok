import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_dragon = opencok_kingdom.table(
    "user_dragon",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull(),
        "uid": varchar("uid", { length: 40 }).notNull(),
        "itemId": integer("itemId").notNull(),
        "level": integer("level").notNull(),
        "exp": integer("exp").notNull(),
        "place": varchar("place", { length: 100 }),
    },
    (table) => [
        primaryKey({ name: "user_dragon_PRIMARY", columns: [table["uuid"]] }),
        index("user_dragon_uid_index").on(sql.raw("\"uid\"")),
    ],
);
