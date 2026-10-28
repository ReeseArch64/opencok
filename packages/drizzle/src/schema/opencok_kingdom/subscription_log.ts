import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const subscription_log = opencok_kingdom.table(
    "subscription_log",
    {
        "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
        "orderId": varchar("orderId", { length: 200 }).notNull().default(sql.raw("''")),
        "itemId": varchar("itemId", { length: 10 }),
        "originalOrderId": varchar("originalOrderId", { length: 200 }),
        "beginTime": bigint("beginTime", { mode: "bigint" }),
        "endTime": bigint("endTime", { mode: "bigint" }),
        "nextCheckTime": bigint("nextCheckTime", { mode: "bigint" }),
    },
    (table) => [
        primaryKey({ name: "subscription_log_PRIMARY", columns: [table["uid"], table["orderId"]] }),
        index("subscription_log_index_uid_itemId").on(sql.raw("\"uid\""), sql.raw("\"itemId\"")),
    ],
);
