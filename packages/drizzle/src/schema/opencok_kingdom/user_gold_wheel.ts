import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_gold_wheel = opencok_kingdom.table(
    "user_gold_wheel",
    {
        "uid": varchar("uid", { length: 50 }).notNull(),
        "hide_king": integer("hide_king").notNull().default(sql.raw("0")),
        "normal_free": integer("normal_free").notNull().default(sql.raw("0")),
        "normal_total": integer("normal_total").notNull().default(sql.raw("0")),
        "normal_last_free_millis": bigint("normal_last_free_millis", { mode: "bigint" })
            .notNull()
            .default(sql.raw("0")),
        "silver_usable": integer("silver_usable").notNull().default(sql.raw("0")),
        "silver_usable_free": integer("silver_usable_free").notNull().default(sql.raw("0")),
        "silver_daily": integer("silver_daily").notNull().default(sql.raw("0")),
        "silver_total": integer("silver_total").notNull().default(sql.raw("0")),
        "silver_last_add_millis": bigint("silver_last_add_millis", { mode: "bigint" })
            .notNull()
            .default(sql.raw("0")),
        "silver_last_free_millis": bigint("silver_last_free_millis", { mode: "bigint" })
            .notNull()
            .default(sql.raw("0")),
        "gold_daily": integer("gold_daily").notNull().default(sql.raw("0")),
        "gold_usable": integer("gold_usable").notNull().default(sql.raw("0")),
        "gold_total": integer("gold_total").notNull().default(sql.raw("0")),
        "gold_last_add_millis": bigint("gold_last_add_millis", { mode: "bigint" })
            .notNull()
            .default(sql.raw("0")),
        "last_normal_wheel_millis": bigint("last_normal_wheel_millis", { mode: "bigint" })
            .notNull()
            .default(sql.raw("0")),
        "rewardFlags": varchar("rewardFlags", { length: 200 }),
    },
    (table) => [primaryKey({ name: "user_gold_wheel_PRIMARY", columns: [table["uid"]] })],
);
