import { sql } from "drizzle-orm";
import {
    bigint,
    check,
    index,
    integer,
    primaryKey,
    text,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const nickname_change = opencok_kingdom.table(
    "nickname_change",
    {
        operationId: uuid("operationId").notNull(),
        ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
        newName: varchar("newName", { length: 200 }).notNull(),
        previousName: varchar("previousName", { length: 255 }).notNull(),
        state: varchar("state", { length: 16 }).notNull(),
        payment: text("payment").notNull(),
        responseGold: bigint("responseGold", { mode: "bigint" }),
        failureCode: varchar("failureCode", { length: 20 }),
        pendingEffects: integer("pendingEffects").notNull().default(sql.raw("0")),
        createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
        updatedAt: bigint("updatedAt", { mode: "bigint" }).notNull(),
        notificationStage: integer("notificationStage").notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "nickname_change_PRIMARY", columns: [table.operationId] }),
        uniqueIndex("nickname_change_prepared_owner")
            .on(table.ownerUid)
            .where(sql`${table.state} = 'prepared'`),
        index("nickname_change_pending").on(
            table.state,
            table.pendingEffects,
            table.ownerUid,
            table.operationId,
        ),
        check(
            "nickname_change_state",
            sql.raw("\"state\" IN ('prepared', 'committed', 'refunded')"),
        ),
        check("nickname_change_owner", sql.raw("length(\"ownerUid\") > 0")),
        check("nickname_change_name", sql.raw("length(\"newName\") > 0")),
        check("nickname_change_payment_bound", sql.raw("octet_length(\"payment\") <= 8192")),
        check("nickname_change_pending_range", sql.raw("\"pendingEffects\" BETWEEN 0 AND 31")),
        check(
            "nickname_change_notification_stage",
            sql.raw(
                "\"notificationStage\" BETWEEN 0 AND 2 AND (\"state\" = 'refunded' OR \"notificationStage\" <= 1)",
            ),
        ),
        check(
            "nickname_change_time",
            sql.raw("\"createdAt\" >= 0 AND \"updatedAt\" >= \"createdAt\""),
        ),
    ],
);
