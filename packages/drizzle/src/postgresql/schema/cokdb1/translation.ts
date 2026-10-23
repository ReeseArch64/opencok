// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const translation = cokdb1.table("translation", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "translation_id_seq", startWith: 1 }),
  "content": legacyBytes("content"),
  "en": legacyBytes("en"),
  "originalLang": legacyText("originalLang", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("'cn'")),
}, (table) => [
  primaryKey({ name: "translation_PRIMARY", columns: [table["id"]] }),
  index("translation_index_content").on(sql.raw("substring(\"content\" from 1 for 50)")),
  check("translation_content_length", sql.raw("octet_length(\"content\") <= 65535")),
  check("translation_en_length", sql.raw("octet_length(\"en\") <= 65535")),
]);
