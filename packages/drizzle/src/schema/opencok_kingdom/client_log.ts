import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const client_log = opencok_kingdom.table(
    "client_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "type": integer("type").notNull(),
        "keyword": varchar("keyword", { length: 200 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({
            name: "client_log_PRIMARY",
            columns: [table["uid"], table["type"], table["keyword"], table["time"]],
        }),
    ],
);
