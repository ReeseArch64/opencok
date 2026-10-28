import { sql } from "drizzle-orm";
import { bigint, index, integer, jsonb, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_feed = opencok_chat.table(
    "chat_feed",
    {
        id: varchar("id", { length: 100 }).primaryKey(),
        owner: varchar("owner", { length: 40 }).notNull(),
        realm: integer("realm").notNull(),
        alliance: varchar("alliance", { length: 40 })
            .notNull()
            .default(sql`''`),
        parent: varchar("parent", { length: 100 }),
        type: integer("type").notNull(),
        body: jsonb("body").notNull(),
        createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
        expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
        deletedAt: bigint("deleted_at", { mode: "bigint" }),
    },
    (table) => [
        index("chat_feed_alliance").on(table.realm, table.alliance, table.createdAt),
        index("chat_feed_owner").on(table.owner, table.createdAt),
        index("chat_feed_expiry").on(table.expiresAt),
    ],
);
