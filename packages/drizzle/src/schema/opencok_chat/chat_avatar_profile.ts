import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";

export const chat_avatar_profile = opencok_chat.table(
  "chat_avatar_profile",
  {
    owner_uid: varchar("owner_uid", { length: 20 }).notNull(),
    kingdom_id: integer("kingdom_id").notNull(),
    sequence: integer("sequence").notNull(),
    pic_ver: integer("pic_ver").notNull(),
    committed_at: bigint("committed_at", { mode: "bigint" }).notNull(),
    user_name: varchar("user_name", { length: 255 }).notNull(),
    platform: varchar("platform", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "chat_avatar_profile_PRIMARY",
      columns: [table.owner_uid, table.kingdom_id],
    }),
    check("chat_avatar_profile_owner", sql.raw("\"owner_uid\" ~ '^[0-9]{1,20}$'")),
    check("chat_avatar_profile_kingdom", sql.raw('"kingdom_id" > 0')),
    check("chat_avatar_profile_sequence", sql.raw('"sequence" BETWEEN 1 AND 999999')),
    check(
      "chat_avatar_profile_version",
      sql.raw('"pic_ver" >= 0 AND "pic_ver" % 1000000 = "sequence"'),
    ),
    check("chat_avatar_profile_time", sql.raw('"committed_at" BETWEEN 0 AND 9007199254740991')),
  ],
);
