import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const continued_cost_rank_watermark = opencok_global.table(
    "continued_cost_rank_watermark",
    {
        periodId: varchar("periodId", { length: 32 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        digest: varchar("digest", { length: 64 }).notNull(),
        scoreCount: integer("scoreCount").notNull(),
        completedAt: bigint("completedAt", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({
            name: "continued_cost_rank_watermark_PRIMARY",
            columns: [table.periodId, table.kingdomId],
        }),
        check(
            "continued_cost_rank_watermark_bounds",
            sql.raw("\"kingdomId\">0 AND \"scoreCount\" BETWEEN 0 AND 100 AND \"completedAt\">=0"),
        ),
    ],
);
