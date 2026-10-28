import { sql } from "drizzle-orm";
import { bigint, check, doublePrecision, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const expedition_stage_watermark = opencok_global.table(
    "expedition_stage_watermark",
    {
        periodId: varchar("periodId", { length: 40 }).notNull(),
        stage: integer("stage").notNull(),
        kingdomId: integer("kingdomId").notNull(),
        opponent: integer("opponent").notNull(),
        digest: varchar("digest", { length: 32 }).notNull(),
        scoreCount: bigint("scoreCount", { mode: "bigint" }).notNull(),
        total: doublePrecision("total").notNull(),
        state: integer("state").notNull(),
        completedAt: bigint("completedAt", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({
            name: "expedition_stage_watermark_PRIMARY",
            columns: [table.periodId, table.stage, table.kingdomId],
        }),
        check(
            "expedition_stage_watermark_bounds",
            sql.raw(
                "\"stage\" BETWEEN 2 AND 8 AND \"kingdomId\">0 AND \"opponent\">0 AND \"kingdomId\"<>\"opponent\" AND \"scoreCount\">=0 AND \"scoreCount\"<=1000000 AND \"total\">=0 AND \"total\"<'Infinity'::double precision AND \"state\" IN (0,1) AND \"completedAt\">=0",
            ),
        ),
    ],
);
