import { sql } from "drizzle-orm";
import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_private_room = opencok_chat.table("chat_private_room", {
    id: varchar("id", { length: 40 }).primaryKey(),
    owner: varchar("owner", { length: 40 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    version: integer("version")
        .notNull()
        .default(sql`1`),
    createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    deletedAt: bigint("deleted_at", { mode: "bigint" }),
});
