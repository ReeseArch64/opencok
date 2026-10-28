import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const sign_in_feed = opencok_kingdom.table(
    "sign_in_feed",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "type": integer("type").notNull().default(sql.raw("0")),
        "feed": varchar("feed", { length: 40 }).notNull(),
        "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "sign_in_feed_PRIMARY",
            columns: [table["uid"], table["type"], table["feed"]],
        }),
    ],
);
