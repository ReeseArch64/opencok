import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const character_provisioning = opencok_global.table(
    "character_provisioning",
    {
        identityId: varchar("identityId", { length: 40 }).notNull(),
        kingdomId: integer("kingdomId").notNull(),
        deviceUuid: varchar("deviceUuid", { length: 100 }).notNull(),
        gameUid: varchar("gameUid", { length: 20 }).notNull(),
        payload: varchar("payload", { length: 4096 }).notNull(),
        state: integer("state")
            .notNull()
            .default(sql`0`),
        createdAt: bigint("createdAt", { mode: "bigint" }).notNull(),
        activatedAt: bigint("activatedAt", { mode: "bigint" })
            .notNull()
            .default(sql`0`),
    },
    (table) => [
        primaryKey({
            name: "character_provisioning_PRIMARY",
            columns: [table.identityId, table.kingdomId],
        }),
        uniqueIndex("character_provisioning_uid").on(table.gameUid),
        uniqueIndex("character_provisioning_device").on(table.kingdomId, table.deviceUuid),
        check("character_provisioning_state", sql`"state" IN (0, 1)`),
    ],
);
