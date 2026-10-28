import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_activity_new = opencok_kingdom.table(
    "user_activity_new",
    {
        "uid": varchar("uid", { length: 40 }).notNull(),
        "actId": integer("actId").notNull(),
        "level": integer("level").notNull(),
        "rewards": varchar("rewards", { length: 1000 }).notNull(),
        "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
        "reserve_1": integer("reserve_1").notNull(),
        "reserve_2": varchar("reserve_2", { length: 1000 }).notNull(),
        "flushTimes": integer("flushTimes").default(sql.raw("0")),
        "flushDate": bigint("flushDate", { mode: "bigint" }).default(sql.raw("0")),
        "receiveLevels": varchar("receiveLevels", { length: 40 }).default(sql.raw("''")),
    },
    (table) => [
        primaryKey({ name: "user_activity_new_PRIMARY", columns: [table["uid"], table["actId"]] }),
    ],
);
