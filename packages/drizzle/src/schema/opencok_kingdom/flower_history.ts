import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const flower_history = opencok_kingdom.table(
    "flower_history",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "sourceID": varchar("sourceID", { length: 255 }).notNull(),
        "targetID": varchar("targetID", { length: 255 }).notNull(),
        "timeVal": bigint("timeVal", { mode: "bigint" }),
        "itemID": integer("itemID"),
        "count": integer("count"),
    },
    (table) => [
        primaryKey({
            name: "flower_history_PRIMARY",
            columns: [table["uid"], table["sourceID"], table["targetID"]],
        }),
    ],
);
