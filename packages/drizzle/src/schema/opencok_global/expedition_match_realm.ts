import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const expedition_match_realm = opencok_global.table(
    "expedition_match_realm",
    {
        periodId: varchar("periodId", { length: 32 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        statistics: text("statistics").notNull(),
        previousMatch: integer("previousMatch").notNull(),
        registeredAt: bigint("registeredAt", { mode: "bigint" }).notNull(),
        opponent: integer("opponent").notNull().default(sql.raw("0")),
        matchedAt: bigint("matchedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "expedition_match_realm_PRIMARY",
            columns: [table.periodId, table.kingdomId],
        }),
        check(
            "expedition_match_realm_bounds",
            sql.raw(
                "\"kingdomId\" > 0 AND \"previousMatch\" >= 0 AND \"previousMatch\" <> \"kingdomId\" AND \"registeredAt\" >= 0 AND \"opponent\" >= 0 AND \"opponent\" <> \"kingdomId\" AND (\"matchedAt\" = 0 OR \"matchedAt\" >= \"registeredAt\") AND octet_length(\"statistics\") BETWEEN 1 AND 8192",
            ),
        ),
    ],
);
