import { bigint, integer, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_social_import = opencok_chat.table("chat_social_import", {
  owner: varchar("owner", { length: 40 }).primaryKey(),
  realm: integer("realm").notNull(),
  createdAt: bigint("created_at", { mode: "bigint" }).notNull(),
});
