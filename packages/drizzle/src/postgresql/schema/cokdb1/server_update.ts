// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_update = cokdb1.table("server_update", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "idx": integer("idx").notNull(),
  "content": legacyBytes("content"),
  "chineseContent": legacyBytes("chineseContent"),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_update_PRIMARY", columns: [table["uid"], table["idx"]] }),
  uniqueIndex("server_update_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"idx\"")),
  check("server_update_content_length", sql.raw("octet_length(\"content\") <= 65535")),
  check("server_update_chineseContent_length", sql.raw("octet_length(\"chineseContent\") <= 65535")),
]);
