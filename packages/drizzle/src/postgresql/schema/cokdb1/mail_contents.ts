// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mail_contents = cokdb1.table("mail_contents", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "contents": legacyBytes("contents").notNull(),
  "toUser": legacyText("toUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "mail_contents_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("mail_contents_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("mail_contents_user_idx").on(sql.raw("rtrim(\"toUser\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("mail_contents_contents_length", sql.raw("octet_length(\"contents\") <= 16777215")),
]);
