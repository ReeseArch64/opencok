import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const red_packets_records = opencok_kingdom.table(
    "red_packets_records",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "player": varchar("player", { length: 255 }).notNull().default(sql.raw("''")),
        "name": varchar("name", { length: 255 }).default(sql.raw("''")),
        "pic": varchar("pic", { length: 40 }),
        "picVer": integer("picVer").default(sql.raw("0")),
        "value": integer("value").default(sql.raw("0")),
        "getTime": bigint("getTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "red_packets_records_PRIMARY",
            columns: [table["uid"], table["player"]],
        }),
        index("red_packets_records_index_player").on(sql.raw("\"player\"")),
    ],
);
