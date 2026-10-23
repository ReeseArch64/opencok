// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const post_mail = cokdb1.table("post_mail", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "boxId": legacyText("boxId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "toUser": legacyText("toUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "fromUser": legacyText("fromUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "fromName": legacyText("fromName", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "contents": legacyBytes("contents").notNull(),
  "seal": legacyText("seal", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "post_mail_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("post_mail_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("post_mail_index_toUserTime").on(sql.raw("rtrim(\"toUser\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("post_mail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
