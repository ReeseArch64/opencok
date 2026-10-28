import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const hero_match_realm = opencok_global.table(
    "hero_match_realm",
    {
        periodId: varchar("periodId", { length: 32 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        power: bigint("power", { mode: "bigint" }).notNull(),
        shuffle: integer("shuffle").notNull(),
        registeredAt: bigint("registeredAt", { mode: "bigint" }).notNull(),
        serverGroup: varchar("serverGroup", { length: 255 }),
        matchedAt: bigint("matchedAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({
            name: "hero_match_realm_PRIMARY",
            columns: [table.periodId, table.kingdomId],
        }),
        check(
            "hero_match_realm_bounds",
            sql.raw(
                "\"kingdomId\" > 0 AND \"power\" >= 0 AND \"shuffle\" >= 0 AND \"registeredAt\" >= 0 AND ((\"serverGroup\" IS NULL AND \"matchedAt\" = 0) OR (\"serverGroup\" IS NOT NULL AND length(\"serverGroup\") > 0 AND \"matchedAt\" >= \"registeredAt\"))",
            ),
        ),
    ],
);
