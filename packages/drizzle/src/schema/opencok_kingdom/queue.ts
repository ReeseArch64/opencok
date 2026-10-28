import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const queue = opencok_kingdom.table(
    "queue",
    {
        "uuid": varchar("uuid", { length: 40 }).notNull(),
        "ownerId": varchar("ownerId", { length: 40 }).notNull(),
        "qid": integer("qid").notNull(),
        "type": integer("type").notNull(),
        "itemId": varchar("itemId", { length: 255 }),
        "startTime": bigint("startTime", { mode: "bigint" }),
        "endTime": bigint("endTime", { mode: "bigint" }).notNull(),
        "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
        "isHelped": integer("isHelped"),
        "para": integer("para").default(sql.raw("0")),
        "totalTime": bigint("totalTime", { mode: "bigint" }).default(sql.raw("0")),
        "exchgType": smallint("exchgType").default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "queue_PRIMARY", columns: [table["uuid"]] }),
        index("queue_ownerId_index_001").on(sql.raw("\"ownerId\"")),
        index("queue_updateTime_index").on(sql.raw("\"updateTime\"")),
        check("queue_exchgType_range", sql.raw("\"exchgType\" BETWEEN -128 AND 127")),
    ],
);
