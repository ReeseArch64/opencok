import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const nickname_change_receipt = opencok_global.table(
    "nickname_change_receipt",
    {
        operationId: uuid("operationId").notNull(),
        ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        newName: varchar("newName", { length: 200 }).notNull(),
        committedAt: bigint("committedAt", { mode: "bigint" }).notNull(),
    },
    (table) => [
        primaryKey({ name: "nickname_change_receipt_PRIMARY", columns: [table.operationId] }),
        index("nickname_change_receipt_owner_realm").on(table.ownerUid, table.kingdomId),
        check("nickname_change_receipt_owner", sql.raw("length(\"ownerUid\") > 0")),
        check("nickname_change_receipt_realm", sql.raw("\"kingdomId\" > 0")),
        check("nickname_change_receipt_name", sql.raw("length(\"newName\") > 0")),
        check("nickname_change_receipt_time", sql.raw("\"committedAt\" >= 0")),
    ],
);
