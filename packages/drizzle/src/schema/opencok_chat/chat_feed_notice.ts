import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_feed_notice = opencok_chat.table(
    "chat_feed_notice",
    {
        owner: varchar("owner", { length: 40 }).notNull(),
        feed: varchar("feed", { length: 100 }).notNull(),
        createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
    },
    (table) => [primaryKey({ columns: [table.owner, table.feed] })],
);
