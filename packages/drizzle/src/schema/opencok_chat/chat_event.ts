import { sql } from "drizzle-orm";
import { bigint, bigserial, index, jsonb, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_event = opencok_chat.table(
    "chat_event",
    {
        sequence: bigserial("sequence", { mode: "bigint" }).primaryKey(),
        id: varchar("id", { length: 40 }).notNull().unique(),
        kind: varchar("kind", { length: 30 }).notNull(),
        room: varchar("room", { length: 160 })
            .notNull()
            .default(sql`''`),
        owner: varchar("owner", { length: 40 }).notNull(),
        target: varchar("target", { length: 40 }),
        message: varchar("message", { length: 100 }),
        data: jsonb("data"),
        createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
        expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
    },
    (table) => [index("chat_event_expiry").on(table.expiresAt)],
);
