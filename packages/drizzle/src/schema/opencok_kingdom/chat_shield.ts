import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const chat_shield = opencok_kingdom.table(
  "chat_shield",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "owner": varchar("owner", { length: 40 }).notNull(),
    "other": varchar("other", { length: 40 }).notNull(),
    "time": bigint("time", { mode: "bigint" }),
  },
  (table) => [
    primaryKey({ name: "chat_shield_PRIMARY", columns: [table["uuid"]] }),
    index("chat_shield_owner_other_index").on(sql.raw('"owner"'), sql.raw('"other"')),
  ],
);
