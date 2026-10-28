import { sql } from "drizzle-orm";
import { check, doublePrecision, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const expedition_stage_member = opencok_kingdom.table(
    "expedition_stage_member",
    {
        periodId: varchar("periodId", { length: 40 }).notNull(),
        stage: integer("stage").notNull(),
        uid: varchar("uid", { length: 40 }).notNull(),
        score: doublePrecision("score").notNull(),
        allianceId: varchar("allianceId", { length: 40 }).notNull(),
        takeReward: varchar("takeReward", { length: 500 }).notNull(),
        eligibility: text("eligibility").notNull(),
        metadata: text("metadata"),
    },
    (table) => [
        primaryKey({
            name: "expedition_stage_member_PRIMARY",
            columns: [table.periodId, table.stage, table.uid],
        }),
        check(
            "expedition_stage_member_bounds",
            sql.raw(
                "\"stage\" BETWEEN 2 AND 8 AND \"score\">=0 AND \"score\"<'Infinity'::double precision AND octet_length(\"eligibility\")<=65536 AND (\"metadata\" IS NULL OR octet_length(\"metadata\")<=8192)",
            ),
        ),
    ],
);
