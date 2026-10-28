import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const building_production = opencok_kingdom.table(
    "building_production",
    {
        buildingId: varchar("buildingId", { length: 40 }).notNull(),
        ownerId: varchar("ownerId", { length: 40 }).notNull(),
        asset: varchar("asset", { length: 32 }).notNull(),
        settledAt: bigint("settledAt", { mode: "bigint" }).notNull(),
        amount: bigint("amount", { mode: "bigint" }).notNull(),
        remainder: bigint("remainder", { mode: "bigint" }).notNull(),
        rates: varchar("rates", { length: 32768 }).notNull(),
    },
    (table) => [
        primaryKey({ name: "building_production_PRIMARY", columns: [table.buildingId] }),
        index("building_production_owner").on(table.ownerId),
        check(
            "building_production_bounds",
            sql`"settledAt" >= 0 AND "amount" >= 0 AND "remainder" >= 0 AND "remainder" < 3600000000000`,
        ),
    ],
);
