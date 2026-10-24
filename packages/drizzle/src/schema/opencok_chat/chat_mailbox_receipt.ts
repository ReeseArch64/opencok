import { bigint, integer, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { opencok_chat } from "../namespaces";
export const chat_mailbox_receipt = opencok_chat.table(
  "chat_mailbox_receipt",
  {
    kingdom_id: integer("kingdom_id").notNull(),
    operation_id: uuid("operation_id").notNull(),
    effect_index: integer("effect_index").notNull(),
    owner_uid: varchar("owner_uid", { length: 40 }).notNull(),
    payload_hash: varchar("payload_hash", { length: 64 }).notNull(),
    requested_at: bigint("requested_at", { mode: "bigint" }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "chat_mailbox_receipt_kingdom_id_operation_id_effect_index_pk",
      columns: [table.kingdom_id, table.operation_id, table.effect_index],
    }),
  ],
);
