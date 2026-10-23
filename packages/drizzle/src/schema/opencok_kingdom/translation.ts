import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const translation = opencok_kingdom.table("translation", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({"name":"translation_id_seq","startWith":1}),
  "content": bytea("content"),
  "en": bytea("en"),
  "originalLang": varchar("originalLang", { length: 255 }).default(sql.raw("'cn'")),
}, (table) => [
  primaryKey({ name: "translation_PRIMARY", columns: [table["id"]] }),
  index("translation_index_content").on(sql.raw("substring(\"content\" from 1 for 50)")),
  check("translation_content_length", sql.raw("octet_length(\"content\") <= 65535")),
  check("translation_en_length", sql.raw("octet_length(\"en\") <= 65535")),
]);
