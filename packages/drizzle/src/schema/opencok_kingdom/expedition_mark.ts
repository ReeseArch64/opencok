import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_mark = opencok_kingdom.table(
    "expedition_mark",
    {
        "serverId": integer("serverId").notNull(),
        "isKickFinished": smallint("isKickFinished").notNull().default(sql.raw("0")),
        "isSendedAward": smallint("isSendedAward").notNull().default(sql.raw("0")),
        "kickFinishTime": bigint("kickFinishTime", { mode: "bigint" }).notNull(),
        "sendAwardTime": bigint("sendAwardTime", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "expedition_mark_PRIMARY", columns: [table["serverId"]] }),
        check(
            "expedition_mark_isKickFinished_range",
            sql.raw("\"isKickFinished\" BETWEEN -128 AND 127"),
        ),
        check(
            "expedition_mark_isSendedAward_range",
            sql.raw("\"isSendedAward\" BETWEEN -128 AND 127"),
        ),
    ],
);
