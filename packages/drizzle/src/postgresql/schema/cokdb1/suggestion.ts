// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const suggestion = cokdb1.table("suggestion", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "ownerId": legacyText("ownerId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "castlelevel": integer("castlelevel"),
  "contents": legacyBytes("contents").notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "replyContent": legacyBytes("replyContent"),
  "replyTime": bigint("replyTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "suggestion_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("suggestion_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("suggestion_ownerId").on(sql.raw("rtrim(\"ownerId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("suggestion_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("suggestion_replyContent_length", sql.raw("octet_length(\"replyContent\") <= 65535")),
]);
