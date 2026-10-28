import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const hero_rank_award = opencok_kingdom.table(
    "hero_rank_award",
    {
        id: varchar("id", { length: 32 }).notNull(),
        ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
        periodId: varchar("periodId", { length: 32 }).notNull(),
        actId: varchar("actId", { length: 40 }).notNull(),
        member: varchar("member", { length: 40 }).notNull(),
        type: integer("type").notNull(),
        rank: integer("rank").notNull(),
        level: integer("level").notNull(),
        rewardId: varchar("rewardId", { length: 255 }),
        pinnedReward: text("pinnedReward"),
        sender: varchar("sender", { length: 100 }).notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        contents: bytea("contents").notNull(),
        createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
        deliveredAt: bigint("deliveredAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
        nextAttemptAt: bigint("nextAttemptAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "hero_rank_award_PRIMARY", columns: [table.id] }),
        index("hero_rank_award_pending").on(
            table.deliveredAt,
            table.nextAttemptAt,
            table.createdAt,
            table.id,
        ),
        check(
            "hero_rank_award_bounds",
            sql.raw(
                "\"type\" BETWEEN 1 AND 4 AND \"rank\" BETWEEN 1 AND 5000 AND \"level\" BETWEEN 0 AND 4095 AND \"createdAt\" >= 0 AND (\"deliveredAt\" = 0 OR \"deliveredAt\" >= \"createdAt\") AND \"nextAttemptAt\" >= 0 AND octet_length(\"contents\") <= 40000 AND (\"pinnedReward\" IS NULL OR octet_length(\"pinnedReward\") <= 65535)",
            ),
        ),
    ],
);
