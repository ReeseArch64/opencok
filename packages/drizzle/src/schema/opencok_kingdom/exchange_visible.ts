import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exchange_visible = opencok_kingdom.table(
    "exchange_visible",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "exchangeId": varchar("exchangeId", { length: 20 }).notNull(),
        "createTime": bigint("createTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({
            name: "exchange_visible_PRIMARY",
            columns: [table["uid"], table["exchangeId"]],
        }),
        index("exchange_visible_uid_index").on(sql.raw("\"uid\"")),
    ],
);
