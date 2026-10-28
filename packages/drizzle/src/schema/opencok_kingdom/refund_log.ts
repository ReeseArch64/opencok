import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const refund_log = opencok_kingdom.table(
    "refund_log",
    {
        "refundId": varchar("refundId", { length: 255 }).notNull(),
        "order": integer("order").notNull(),
        "time": bigint("time", { mode: "bigint" }).notNull(),
        "userId": varchar("userId", { length: 255 }).notNull(),
        "type": integer("type"),
        "itemId": varchar("itemId", { length: 16 }).notNull(),
        "original": bigint("original", { mode: "bigint" }).notNull(),
        "cost": integer("cost").notNull(),
        "remain": bigint("remain", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "refund_log_PRIMARY", columns: [table["refundId"], table["order"]] }),
        index("refund_log_index_time").on(
            sql.raw("\"time\""),
            sql.raw("\"userId\""),
            sql.raw("\"type\""),
            sql.raw("\"itemId\""),
        ),
        index("refund_log_index_user").on(sql.raw("\"userId\""), sql.raw("\"time\"")),
    ],
);
