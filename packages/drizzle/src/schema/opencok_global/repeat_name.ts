import { sql } from "drizzle-orm";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const repeat_name = opencok_global.table(
    "repeat_name",
    {
        "gameUid": varchar("gameUid", { length: 255 }).notNull(),
        "gameUserName": varchar("gameUserName", { length: 255 }).notNull(),
        "server": varchar("server", { length: 40 }),
        "minServer": varchar("minServer", { length: 40 }),
    },
    (table) => [
        primaryKey({ name: "repeat_name_PRIMARY", columns: [table["gameUid"]] }),
        index("repeat_name_server_index").on(sql.raw("\"server\"")),
        index("repeat_name_name_index").on(sql.raw("\"gameUserName\"")),
    ],
);
