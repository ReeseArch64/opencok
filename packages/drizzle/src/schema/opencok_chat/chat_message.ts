import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  numeric,
  primaryKey,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_chat } from "../namespaces";

export const chat_message = opencok_chat.table(
  "chat_message",
  {
    "sequence_id": numeric("sequence_id", { precision: 20, scale: 0, mode: "bigint" })
      .notNull()
      .default(
        sql.raw(
          'nextval(\'"opencok_chat"."chat_message_sequence_id_seq"\'::regclass)::numeric + 9223372036854775808',
        ),
      ),
    "room_key": varchar("room_key", { length: 160 }).notNull(),
    "sender_uid": varchar("sender_uid", { length: 40 }).notNull(),
    "idempotency_key": bytea("idempotency_key").notNull(),
    "body": text("body"),
    "body_hash": varchar("body_hash", { length: 64 }),
    "archive_at": text("archive_at"),
    "post_type": integer("post_type").notNull().default(0),
    "version": integer("version").notNull().default(1),
    "deleted_at": text("deleted_at"),
    "created_at": text("created_at").notNull(),
    "expires_at": text("expires_at").notNull(),
  },
  (table) => [
    primaryKey({ name: "chat_message_PRIMARY", columns: [table["sequence_id"]] }),
    uniqueIndex("chat_message_uq_sender_room_client").on(
      sql.raw('"sender_uid"'),
      sql.raw('"room_key"'),
      sql.raw('"idempotency_key"'),
    ),
    index("chat_message_idx_room_sequence").on(sql.raw('"room_key"'), sql.raw('"sequence_id"')),
    index("chat_message_idx_message_expiry").on(sql.raw('"expires_at"')),
    check(
      "chat_message_sequence_id_range",
      sql.raw('"sequence_id" >= 0 AND "sequence_id" <= 18446744073709551615'),
    ),
    check("chat_message_idempotency_key_length", sql.raw('octet_length("idempotency_key") <= 64')),
    check(
      "chat_message_created_at_temporal",
      sql.raw(
        '("created_at" IS NULL OR (CASE WHEN "created_at" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$\' THEN CASE WHEN left("created_at",4) <> \'0000\' AND substring("created_at",6,2) <> \'00\' AND substring("created_at",9,2) <> \'00\' THEN to_char(to_date(left("created_at",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("created_at",10) ELSE true END ELSE false END))',
      ),
    ),
    check(
      "chat_message_expires_at_temporal",
      sql.raw(
        '("expires_at" IS NULL OR (CASE WHEN "expires_at" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$\' THEN CASE WHEN left("expires_at",4) <> \'0000\' AND substring("expires_at",6,2) <> \'00\' AND substring("expires_at",9,2) <> \'00\' THEN to_char(to_date(left("expires_at",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("expires_at",10) ELSE true END ELSE false END))',
      ),
    ),
  ],
);
