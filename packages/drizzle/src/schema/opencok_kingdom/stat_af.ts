import { sql } from "drizzle-orm";
import { check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const stat_af = opencok_kingdom.table(
    "stat_af",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "afuid": varchar("afuid", { length: 200 }),
        "device": varchar("device", { length: 10 }),
        "country": varchar("country", { length: 20 }),
        "channel": varchar("channel", { length: 50 }),
        "campain": varchar("campain", { length: 100 }),
        "fulldata": bytea("fulldata"),
    },
    (table) => [
        primaryKey({ name: "stat_af_PRIMARY", columns: [table["uid"]] }),
        index("stat_af_index_af").on(sql.raw("\"afuid\"")),
        index("stat_af_index_query").on(
            sql.raw("\"device\""),
            sql.raw("\"country\""),
            sql.raw("\"channel\""),
            sql.raw("\"campain\""),
        ),
        check("stat_af_fulldata_length", sql.raw("octet_length(\"fulldata\") <= 65535")),
    ],
);
