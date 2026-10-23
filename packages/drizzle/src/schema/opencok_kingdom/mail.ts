import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea, utf8Bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const mail = opencok_kingdom.table("mail", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "toUser": varchar("toUser", { length: 40 }).notNull(),
  "fromUser": varchar("fromUser", { length: 40 }),
  "fromName": varchar("fromName", { length: 100 }).default(sql.raw("''")),
  "title": varchar("title", { length: 255 }).notNull().default(sql.raw("''")),
  "contents": bytea("contents").notNull(),
  "rewardId": utf8Bytea("rewardId"),
  "itemIdFlag": integer("itemIdFlag").default(sql.raw("0")),
  "status": integer("status").default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("1")),
  "rewardStatus": integer("rewardStatus").notNull().default(sql.raw("0")),
  "saveFlag": integer("saveFlag").default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "reply": integer("reply").notNull().default(sql.raw("0")),
  "translationId": varchar("translationId", { length: 255 }),
}, (table) => [
  primaryKey({ name: "mail_PRIMARY", columns: [table["uid"]] }),
  index("mail_index_toFrom").on(sql.raw("\"toUser\""), sql.raw("\"type\""), sql.raw("\"fromUser\"")),
  index("mail_index_toUserTime").on(sql.raw("\"toUser\""), sql.raw("\"createTime\"")),
  check("mail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
