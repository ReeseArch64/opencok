// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mail = cokdb1.table("mail", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "toUser": legacyText("toUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "fromUser": legacyText("fromUser", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "fromName": legacyText("fromName", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "title": legacyText("title", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "contents": legacyBytes("contents").notNull(),
  "rewardId": legacyText("rewardId", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "itemIdFlag": integer("itemIdFlag").default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("1")),
  "rewardStatus": integer("rewardStatus").notNull().default(sql.raw("0")),
  "saveFlag": integer("saveFlag").default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "reply": integer("reply").notNull().default(sql.raw("0")),
  "translationId": legacyText("translationId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "mail_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("mail_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("mail_index_toFrom").on(sql.raw("rtrim(\"toUser\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\""), sql.raw("rtrim(\"fromUser\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("mail_index_toUserTime").on(sql.raw("rtrim(\"toUser\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("mail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
