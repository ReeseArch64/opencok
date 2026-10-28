import { sql } from "drizzle-orm";
import { bigint, check, jsonb, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const resource_settlement = opencok_kingdom.table(
    "resource_settlement",
    {
        uid: varchar("uid", { length: 40 }).notNull(),
        fromTime: bigint("fromTime", { mode: "bigint" }).notNull(),
        toTime: bigint("toTime", { mode: "bigint" }).notNull(),
        ownerEpoch: bigint("ownerEpoch", { mode: "bigint" }).notNull(),
        foodBefore: bigint("foodBefore", { mode: "bigint" }).notNull(),
        foodAfter: bigint("foodAfter", { mode: "bigint" }).notNull(),
        boundBefore: bigint("boundBefore", { mode: "bigint" }).notNull(),
        boundAfter: bigint("boundAfter", { mode: "bigint" }).notNull(),
        starvingMillis: bigint("starvingMillis", { mode: "bigint" }).notNull(),
        troopChanges: jsonb("troopChanges")
            .$type<
                readonly {
                    armyId: string;
                    freeBefore: number;
                    freeAfter: number;
                    defenceBefore: number;
                    defenceAfter: number;
                    weakened: number;
                    dead: number;
                }[]
            >()
            .notNull(),
    },
    (table) => [
        primaryKey({
            name: "resource_settlement_uid_fromTime_toTime_pk",
            columns: [table.uid, table.fromTime, table.toTime],
        }),
        check("resource_settlement_interval", sql`${table.toTime} > ${table.fromTime}`),
        check("resource_settlement_epoch", sql`${table.ownerEpoch} > 0`),
        check("resource_settlement_starvation", sql`${table.starvingMillis} >= 0`),
    ],
);
