import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const avatar_version_update = opencok_kingdom.table(
    "avatar_version_update",
    {
        operationId: varchar("operationId", { length: 32 }).notNull(),
        ownerUid: varchar("ownerUid", { length: 20 }).notNull(),
        picVer: integer("picVer").notNull(),
        committedAt: bigint("committedAt", { mode: "bigint" }).notNull(),
        nextUpdateTime: bigint("nextUpdateTime", { mode: "bigint" }),
        effects: text("effects").notNull(),
        pendingEffects: integer("pendingEffects").notNull(),
        revision: bigint("revision", { mode: "bigint" }).notNull().default(sql.raw("0")),
    },
    (table) => [
        primaryKey({ name: "avatar_version_update_PRIMARY", columns: [table.operationId] }),
        index("avatar_version_update_pending").on(
            table.pendingEffects,
            table.ownerUid,
            table.operationId,
        ),
        check("avatar_version_update_id", sql.raw("\"operationId\" ~ '^[a-f0-9]{32}$'")),
        check("avatar_version_update_owner", sql.raw("\"ownerUid\" ~ '^[0-9]{1,20}$'")),
        check(
            "avatar_version_update_version",
            sql.raw("\"picVer\" >= 0 OR \"pendingEffects\" = 0"),
        ),
        check("avatar_version_update_time", sql.raw("\"committedAt\" >= 0")),
        check("avatar_version_update_effects_size", sql.raw("octet_length(\"effects\") <= 65535")),
        check(
            "avatar_version_update_pending_range",
            sql.raw("\"pendingEffects\" BETWEEN 0 AND 15"),
        ),
    ],
);
