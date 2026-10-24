import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const mail_chat_read_intent = opencok_kingdom.table(
  "mail_chat_read_intent",
  {
    commandId: uuid("commandId").notNull(),
    effectIndex: integer("effectIndex").notNull(),
    ownerUid: varchar("ownerUid", { length: 40 }).notNull(),
    others: varchar("others", { length: 40 }).notNull(),
    chatTypes: varchar("chatTypes", { length: 4 }).notNull(),
    requestedAt: bigint("requestedAt", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "mail_chat_read_intent_PRIMARY",
      columns: [table.commandId, table.effectIndex],
    }),
    index("mail_chat_read_intent_pending").on(
      table.requestedAt,
      table.commandId,
      table.effectIndex,
    ),
    index("mail_chat_read_intent_owner").on(table.ownerUid),
    check(
      "mail_chat_read_intent_effect_range",
      sql.raw('"effectIndex" >= 0 AND "effectIndex" <= 1001'),
    ),
    check("mail_chat_read_intent_owner_nonempty", sql.raw('length("ownerUid") > 0')),
    check("mail_chat_read_intent_types", sql.raw("\"chatTypes\" IN ('1,20', '2', '3')")),
    check("mail_chat_read_intent_time_nonnegative", sql.raw('"requestedAt" >= 0')),
  ],
);
