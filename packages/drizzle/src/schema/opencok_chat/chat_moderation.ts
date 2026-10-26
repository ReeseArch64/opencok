import { sql } from "drizzle-orm";
import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_moderation = opencok_chat.table("chat_moderation", {
  owner: varchar("owner", { length: 40 }).primaryKey(),
  muteUntil: bigint("mute_until", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
  noticeUntil: bigint("notice_until", { mode: "bigint" })
    .notNull()
    .default(sql`0`),
  actor: varchar("actor", { length: 40 }).notNull(),
  reason: varchar("reason", { length: 500 })
    .notNull()
    .default(sql`''`),
  version: integer("version")
    .notNull()
    .default(sql`1`),
  updatedAt: bigint("updated_at", { mode: "bigint" }).notNull(),
});
