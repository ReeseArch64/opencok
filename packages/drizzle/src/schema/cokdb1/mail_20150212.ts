import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const mail_20150212 = cokdb1.table("mail_20150212", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "toUser": varchar("toUser", { length: 40 }).notNull(),
  "fromUser": varchar("fromUser", { length: 40 }),
  "fromName": varchar("fromName", { length: 100 }).notNull(),
  "title": varchar("title", { length: 40 }).notNull(),
  "contents": bytea("contents").notNull(),
  "rewardId": bytea("rewardId"),
  "itemIdFlag": integer("itemIdFlag").default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("1")),
  "rewardStatus": integer("rewardStatus").notNull().default(sql.raw("0")),
  "saveFlag": integer("saveFlag").default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "reply": integer("reply").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "mail_20150212_PRIMARY", columns: [table["uid"]] }),
  index("mail_20150212_index_toFrom").on(sql.raw("\"toUser\""), sql.raw("\"type\""), sql.raw("\"fromUser\"")),
  index("mail_20150212_index_toUserTime").on(sql.raw("\"toUser\""), sql.raw("\"createTime\"")),
  check("mail_20150212_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("mail_20150212_rewardId_length", sql.raw("octet_length(\"rewardId\") <= 65535")),
]);
