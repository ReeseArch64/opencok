import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const post_relation = opencok_kingdom.table(
    "post_relation",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "publicValue": varchar("publicValue", { length: 600 }),
        "time": bigint("time", { mode: "bigint" }).notNull(),
        "players": varchar("players", { length: 600 }),
    },
    (table) => [
        primaryKey({ name: "post_relation_PRIMARY", columns: [table["uid"]] }),
        index("post_relation_index_time").on(sql.raw("\"time\"")),
    ],
);
