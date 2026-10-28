import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const stat_phone_log = opencok_kingdom.table(
    "stat_phone_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "phoneDevice": varchar("phoneDevice", { length: 255 }).notNull(),
        "model": varchar("model", { length: 255 }).notNull(),
        "version": varchar("version", { length: 255 }).notNull(),
        "width": integer("width").notNull(),
        "height": integer("height").notNull(),
        "count": integer("count"),
        "time": bigint("time", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({
            name: "stat_phone_log_PRIMARY",
            columns: [
                table["uid"],
                table["phoneDevice"],
                table["model"],
                table["version"],
                table["width"],
                table["height"],
            ],
        }),
        index("stat_phone_log_idx").on(sql.raw("\"uid\""), sql.raw("\"time\"")),
    ],
);
