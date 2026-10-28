import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const king_fight_log = opencok_kingdom.table(
    "king_fight_log",
    {
        "id": integer("id")
            .notNull()
            .generatedByDefaultAsIdentity({ "name": "king_fight_log_id_seq", "startWith": 46500 }),
        "index": integer("index").notNull(),
        "logTime": bigint("logTime", { mode: "bigint" }).default(sql.raw("0")),
        "logType": varchar("logType", { length: 128 }).default(sql.raw("''")),
        "uid": varchar("uid", { length: 128 }).default(sql.raw("''")),
        "log": varchar("log", { length: 2048 }).default(sql.raw("''")),
    },
    (table) => [
        primaryKey({ name: "king_fight_log_PRIMARY", columns: [table["id"]] }),
        index("king_fight_log_uid_index").on(sql.raw("\"uid\"")),
    ],
);
