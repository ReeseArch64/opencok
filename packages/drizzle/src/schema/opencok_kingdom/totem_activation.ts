import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const totem_activation = opencok_kingdom.table(
    "totem_activation",
    {
        id: varchar("id", { length: 40 }).notNull(),
        ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
        pointId: integer("pointId").notNull(),
        totemId: integer("totemId").notNull(),
        allianceId: varchar("allianceId", { length: 40 }).notNull(),
        startedAt: bigint("startedAt", { mode: "bigint" }).notNull(),
        dueAt: bigint("dueAt", { mode: "bigint" }).notNull(),
        status: integer("status").notNull(),
        payload: bytea("payload").notNull(),
    },
    (table) => [
        primaryKey({ name: "totem_activation_PRIMARY", columns: [table.id] }),
        index("totem_activation_due").on(table.status, table.dueAt, table.id),
        index("totem_activation_owner").on(table.ownerUid, table.status),
        check(
            "totem_activation_bounds",
            sql`"pointId" > 0 AND "totemId" > 0 AND "startedAt" >= 0 AND "dueAt" >= "startedAt" AND "status" IN (0, 1, 2) AND octet_length("payload") <= 4096`,
        ),
    ],
);
