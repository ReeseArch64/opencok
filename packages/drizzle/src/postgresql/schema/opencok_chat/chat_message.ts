// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyTemporal, legacyText, unsignedBigint } from "../../types";
import { opencok_chat } from "../namespaces";
export const chat_message = opencok_chat.table("chat_message", {
  "sequence_id": unsignedBigint("sequence_id").notNull().default(sql.raw("legacy_meta.next_unsigned('opencok_chat.chat_message')")),
  "room_key": legacyText("room_key", {"sqlType":"character varying(160)","collation":"C"}).notNull(),
  "sender_uid": legacyText("sender_uid", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "idempotency_key": legacyBytes("idempotency_key").notNull(),
  "body": legacyText("body", {"sqlType":"text","collation":"C"}).notNull(),
  "created_at": legacyTemporal("created_at").notNull(),
  "expires_at": legacyTemporal("expires_at").notNull(),
}, (table) => [
  primaryKey({ name: "chat_message_PRIMARY", columns: [table["sequence_id"]] }),
  uniqueIndex("chat_message_uq_sender_room_client").on(sql.raw("rtrim(\"sender_uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"room_key\", ' ') COLLATE \"C\""), sql.raw("\"idempotency_key\"")),
  index("chat_message_idx_room_sequence").on(sql.raw("rtrim(\"room_key\", ' ') COLLATE \"C\""), sql.raw("\"sequence_id\"")),
  index("chat_message_idx_message_expiry").on(sql.raw("\"expires_at\"")),
  check("chat_message_sequence_id_range", sql.raw("\"sequence_id\" >= 0 AND \"sequence_id\" <= 18446744073709551615")),
  check("chat_message_idempotency_key_length", sql.raw("octet_length(\"idempotency_key\") <= 64")),
  check("chat_message_created_at_temporal", sql.raw("legacy_meta.valid_temporal(\"created_at\", 'datetime', 3)")),
  check("chat_message_expires_at_temporal", sql.raw("legacy_meta.valid_temporal(\"expires_at\", 'datetime', 3)")),
]);
