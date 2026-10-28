import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const suggest_log = opencok_kingdom.table(
    "suggest_log",
    {
        "uuid": varchar("uuid", { length: 50 }).notNull(),
        "user": varchar("user", { length: 200 }).notNull(),
        "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
        "description": bytea("description"),
        "param1": integer("param1"),
        "param2": varchar("param2", { length: 255 }),
    },
    (table) => [
        primaryKey({ name: "suggest_log_PRIMARY", columns: [table["uuid"]] }),
        index("suggest_log_index").on(sql.raw("\"user\""), sql.raw("\"timeStamp\"")),
        index("suggest_log_index_2").on(sql.raw("\"user\"")),
        index("suggest_log_index_3").on(sql.raw("\"param1\""), sql.raw("\"param2\"")),
        check("suggest_log_description_length", sql.raw("octet_length(\"description\") <= 65535")),
    ],
);
