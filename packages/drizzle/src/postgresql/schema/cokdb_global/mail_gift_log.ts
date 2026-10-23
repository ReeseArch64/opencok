// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const mail_gift_log = cokdb_global.table("mail_gift_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "fromUid": legacyText("fromUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "fromName": legacyText("fromName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "toUid": legacyText("toUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "toName": legacyText("toName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "contents": legacyBytes("contents"),
  "rewards": legacyText("rewards", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "isOpened": smallint("isOpened"),
  "isRewarded": smallint("isRewarded"),
  "isThanks": smallint("isThanks"),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "mail_gift_log_PRIMARY", columns: [table["uid"], table["sendTime"]] }),
  uniqueIndex("mail_gift_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"sendTime\"")),
  check("mail_gift_log_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("mail_gift_log_isOpened_range", sql.raw("\"isOpened\" BETWEEN -128 AND 127")),
  check("mail_gift_log_isRewarded_range", sql.raw("\"isRewarded\" BETWEEN -128 AND 127")),
  check("mail_gift_log_isThanks_range", sql.raw("\"isThanks\" BETWEEN -128 AND 127")),
]);
