import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const hero_rank_watermark = opencok_global.table(
    "hero_rank_watermark",
    {
        periodId: varchar("periodId", { length: 32 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        actId: varchar("actId", { length: 40 }),
        state: integer("state").notNull().default(sql.raw("0")),
        digest: varchar("digest", { length: 32 }).notNull(),
        scoreCount: bigint("scoreCount", { mode: "bigint" }).notNull().default(sql.raw("0")),
        eligible: integer("eligible").notNull(),
        completedAt: bigint("completedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
        total: bigint("total", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "hero_rank_watermark_PRIMARY",
            columns: [table.periodId, table.kingdomId],
        }),
        index("hero_rank_watermark_source").on(table.kingdomId, table.actId, table.state),
        check(
            "hero_rank_watermark_bounds",
            sql.raw(
                "\"kingdomId\" > 0 AND \"state\" IN (0,1) AND \"scoreCount\" >= 0 AND \"scoreCount\" <= 1000000 AND \"eligible\" IN (0,1) AND \"completedAt\" >= 0 AND (\"actId\" IS NOT NULL OR (\"eligible\" = 0 AND \"scoreCount\" = 0 AND \"total\" = 0))",
            ),
        ),
    ],
);
