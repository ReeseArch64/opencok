import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const branch_link = opencok_kingdom.table(
    "branch_link",
    {
        "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
        "serverId": integer("serverId").notNull().default(sql.raw("0")),
        "fromUid": varchar("fromUid", { length: 255 }).notNull().default(sql.raw("''")),
        "fromServerId": integer("fromServerId"),
        "type": varchar("type", { length: 128 }),
        "data": varchar("data", { length: 255 }).notNull().default(sql.raw("''")),
        "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
        "modifyTime": bigint("modifyTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "branch_link_PRIMARY",
            columns: [table["uid"], table["serverId"], table["data"]],
        }),
        index("branch_link_branch_link_from_index").on(sql.raw("\"fromUid\"")),
        index("branch_link_branch_link_type_index").on(sql.raw("\"type\"")),
    ],
);
