import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_private_member = opencok_chat.table(
  "chat_private_member",
  {
    room: varchar("room", { length: 40 }).notNull(),
    owner: varchar("owner", { length: 40 }).notNull(),
    role: integer("role").notNull(),
    joinedAt: bigint("joined_at", { mode: "bigint" }).notNull(),
    leftAt: bigint("left_at", { mode: "bigint" }),
    readSequence: bigint("read_sequence", { mode: "bigint" })
      .notNull()
      .default(sql`0`),
  },
  (table) => [
    primaryKey({ columns: [table.room, table.owner] }),
    index("chat_private_member_owner").on(table.owner, table.leftAt),
  ],
);
