import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_period = opencok_kingdom.table(
    "expedition_period",
    {
        serverId: integer("serverId").notNull(),
        periodId: varchar("periodId", { length: 40 }).notNull(),
        matchServerId: integer("matchServerId").notNull(),
        schedule: varchar("schedule", { length: 8192 }).notNull(),
        startTime: bigint("startTime", { mode: "bigint" }).notNull(),
        endTime: bigint("endTime", { mode: "bigint" }).notNull(),
        victoryTimes: integer("victoryTimes").notNull().default(sql.raw("0")),
        count: integer("count").notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "expedition_period_PRIMARY", columns: [table.serverId] }),
        check(
            "expedition_period_bounds",
            sql.raw(
                "\"serverId\" > 0 AND \"matchServerId\" > 0 AND \"matchServerId\" <> \"serverId\" AND \"startTime\" >= 0 AND \"endTime\" > \"startTime\" AND \"victoryTimes\" >= 0 AND \"count\" >= 0",
            ),
        ),
    ],
);
