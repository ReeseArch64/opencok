import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const receive_heart = opencok_kingdom.table(
    "receive_heart",
    {
        uid: varchar("uid", { length: 40 }).notNull(),
        duration: integer("duration").notNull(),
        effecttype: varchar("effecttype", { length: 2 }).notNull(),
        senduid: varchar("senduid", { length: 40 }).notNull(),
        id: integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ name: "receive_heart_id_seq", startWith: 1 }),
    },
    (table) => [
        primaryKey({ name: "receive_heart_PRIMARY", columns: [table.id] }),
        index("receive_heart_owner").on(table.uid, table.id),
    ],
);
