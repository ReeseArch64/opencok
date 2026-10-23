import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_global } from "../namespaces";

export const mail_gift_log = opencok_global.table("mail_gift_log", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "fromUid": varchar("fromUid", { length: 40 }),
  "fromName": varchar("fromName", { length: 200 }),
  "toUid": varchar("toUid", { length: 40 }),
  "toName": varchar("toName", { length: 200 }),
  "contents": bytea("contents"),
  "rewards": varchar("rewards", { length: 1000 }),
  "isOpened": smallint("isOpened"),
  "isRewarded": smallint("isRewarded"),
  "isThanks": smallint("isThanks"),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "mail_gift_log_PRIMARY", columns: [table["uid"], table["sendTime"]] }),
  check("mail_gift_log_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("mail_gift_log_isOpened_range", sql.raw("\"isOpened\" BETWEEN -128 AND 127")),
  check("mail_gift_log_isRewarded_range", sql.raw("\"isRewarded\" BETWEEN -128 AND 127")),
  check("mail_gift_log_isThanks_range", sql.raw("\"isThanks\" BETWEEN -128 AND 127")),
]);
