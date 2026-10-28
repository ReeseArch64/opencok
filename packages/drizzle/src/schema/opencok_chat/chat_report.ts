import { bigint, index, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_report = opencok_chat.table(
    "chat_report",
    {
        id: varchar("id", { length: 40 }).primaryKey(),
        owner: varchar("owner", { length: 40 }).notNull(),
        target: varchar("target", { length: 40 }).notNull(),
        message: varchar("message", { length: 100 }),
        reason: varchar("reason", { length: 2000 }).notNull(),
        createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
        expiresAt: bigint("expires_at", { mode: "bigint" }).notNull(),
    },
    (table) => [index("chat_report_expiry").on(table.expiresAt)],
);
