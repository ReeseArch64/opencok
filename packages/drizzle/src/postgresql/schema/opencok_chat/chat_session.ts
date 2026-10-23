// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyTemporal, legacyText } from "../../types";
import { opencok_chat } from "../namespaces";
export const chat_session = opencok_chat.table("chat_session", {
  "token_hash": legacyBytes("token_hash").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "created_at": legacyTemporal("created_at").notNull(),
  "expires_at": legacyTemporal("expires_at").notNull(),
}, (table) => [
  primaryKey({ name: "chat_session_PRIMARY", columns: [table["token_hash"]] }),
  index("chat_session_idx_session_uid_expiry").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"expires_at\"")),
  index("chat_session_idx_session_expiry").on(sql.raw("\"expires_at\"")),
  check("chat_session_token_hash_length", sql.raw("octet_length(\"token_hash\") = 32")),
  check("chat_session_created_at_temporal", sql.raw("legacy_meta.valid_temporal(\"created_at\", 'datetime', 3)")),
  check("chat_session_expires_at_temporal", sql.raw("legacy_meta.valid_temporal(\"expires_at\", 'datetime', 3)")),
]);
