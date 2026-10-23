import { sql } from "drizzle-orm";
import { check, index, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_chat } from "../namespaces";

export const chat_session = opencok_chat.table("chat_session", {
  "token_hash": bytea("token_hash").notNull(),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "created_at": text("created_at").notNull(),
  "expires_at": text("expires_at").notNull(),
}, (table) => [
  primaryKey({ name: "chat_session_PRIMARY", columns: [table["token_hash"]] }),
  index("chat_session_idx_session_uid_expiry").on(sql.raw("\"uid\""), sql.raw("\"expires_at\"")),
  index("chat_session_idx_session_expiry").on(sql.raw("\"expires_at\"")),
  check("chat_session_token_hash_length", sql.raw("octet_length(\"token_hash\") = 32")),
  check("chat_session_created_at_temporal", sql.raw("(\"created_at\" IS NULL OR (CASE WHEN \"created_at\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left(\"created_at\",4) <> '0000' AND substring(\"created_at\",6,2) <> '00' AND substring(\"created_at\",9,2) <> '00' THEN to_char(to_date(left(\"created_at\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"created_at\",10) ELSE true END ELSE false END))")),
  check("chat_session_expires_at_temporal", sql.raw("(\"expires_at\" IS NULL OR (CASE WHEN \"expires_at\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9][.][0-9]{3}$' THEN CASE WHEN left(\"expires_at\",4) <> '0000' AND substring(\"expires_at\",6,2) <> '00' AND substring(\"expires_at\",9,2) <> '00' THEN to_char(to_date(left(\"expires_at\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"expires_at\",10) ELSE true END ELSE false END))")),
]);
