import { sql } from "drizzle-orm";
import {
    bigint,
    check,
    index,
    integer,
    primaryKey,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const special_event_purchase = opencok_global.table(
    "special_event_purchase",
    {
        eventId: varchar("eventId", { length: 128 }).notNull(),
        ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        exchangeId: varchar("exchangeId", { length: 40 }).notNull(),
        periodStart: bigint("periodStart", { mode: "bigint" }).notNull(),
        periodEnd: bigint("periodEnd", { mode: "bigint" }).notNull(),
        reservedAt: bigint("reservedAt", { mode: "bigint" }).notNull(),
        purchaseTime: bigint("purchaseTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
        purchaseDay: bigint("purchaseDay", { mode: "bigint" }).notNull(),
        state: integer("state").notNull().default(sql.raw("0")),
        deliveredAt: bigint("deliveredAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
        nextAttemptAt: bigint("nextAttemptAt", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "special_event_purchase_PRIMARY", columns: [table.eventId] }),
        uniqueIndex("special_event_purchase_daily")
            .on(table.ownerUid, table.kingdomId, table.exchangeId, table.purchaseDay)
            .where(sql.raw("\"state\" < 2")),
        index("special_event_purchase_stock").on(table.periodStart, table.exchangeId, table.state),
        index("special_event_purchase_delivery").on(
            table.kingdomId,
            table.state,
            table.deliveredAt,
            table.nextAttemptAt,
            table.eventId,
        ),
        check(
            "special_event_purchase_state",
            sql.raw("\"state\" BETWEEN 0 AND 2 AND \"kingdomId\" > 0"),
        ),
        check(
            "special_event_purchase_period",
            sql.raw(
                "\"periodStart\" >= 0 AND \"periodEnd\" >= \"periodStart\" AND \"reservedAt\" BETWEEN \"periodStart\" AND \"periodEnd\"",
            ),
        ),
        check(
            "special_event_purchase_payment",
            sql.raw(
                "(\"state\" = 1 AND \"purchaseTime\" > 0 AND \"purchaseTime\" BETWEEN \"periodStart\" AND \"periodEnd\" AND \"purchaseDay\" = \"purchaseTime\" / 86400000) OR (\"state\" IN (0, 2) AND \"purchaseTime\" = 0 AND \"deliveredAt\" = 0 AND \"purchaseDay\" = \"reservedAt\" / 86400000)",
            ),
        ),
        check(
            "special_event_purchase_clock",
            sql.raw(
                "\"purchaseTime\" >= 0 AND \"purchaseDay\" >= 0 AND \"deliveredAt\" >= 0 AND \"nextAttemptAt\" >= 0",
            ),
        ),
    ],
);
