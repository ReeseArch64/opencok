import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const reward_log = opencok_kingdom.table(
    "reward_log",
    {
        "uid": varchar("uid", { length: 255 }).notNull(),
        "rewardid": varchar("rewardid", { length: 255 }).notNull(),
        "nownum": integer("nownum").default(sql.raw("0")),
        "totalnum": bigint("totalnum", { mode: "bigint" }).default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "reward_log_PRIMARY", columns: [table["uid"], table["rewardid"]] }),
    ],
);
