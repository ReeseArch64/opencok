import { sql } from "drizzle-orm";
import { bigint, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_consumer = opencok_chat.table("chat_consumer", {
    id: varchar("id", { length: 100 }).primaryKey(),
    cursor: bigint("cursor", { mode: "bigint" })
        .notNull()
        .default(sql`0`),
    token: varchar("token", { length: 40 }).notNull(),
    leaseUntil: bigint("lease_until", { mode: "bigint" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "bigint" }).notNull(),
});
