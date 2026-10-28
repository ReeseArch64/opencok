import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exchange_condition = opencok_kingdom.table(
    "exchange_condition",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "soldierDead": bigint("soldierDead", { mode: "bigint" }).default(sql.raw("0")),
        "deadFlushTime": bigint("deadFlushTime", { mode: "bigint" }).default(sql.raw("0")),
        "payGold": integer("payGold").default(sql.raw("1")),
        "goldFlushTime": bigint("goldFlushTime", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [primaryKey({ name: "exchange_condition_PRIMARY", columns: [table["uid"]] })],
);
