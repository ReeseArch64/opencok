import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_alliance_task = opencok_kingdom.table(
    "user_alliance_task",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "id": varchar("id", { length: 255 }).notNull(),
        "itemId": varchar("itemId", { length: 255 }),
        "num": bigint("num", { mode: "bigint" }).default(sql.raw("0")),
        "state": integer("state").default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "user_alliance_task_PRIMARY", columns: [table["uid"], table["id"]] }),
        index("user_alliance_task_id_idx").on(sql.raw("\"id\"")),
    ],
);
