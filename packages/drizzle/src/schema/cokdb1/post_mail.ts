import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const post_mail = cokdb1.table("post_mail", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "boxId": varchar("boxId", { length: 40 }).notNull(),
  "toUser": varchar("toUser", { length: 40 }).notNull(),
  "fromUser": varchar("fromUser", { length: 40 }),
  "fromName": varchar("fromName", { length: 100 }).notNull(),
  "contents": bytea("contents").notNull(),
  "seal": varchar("seal", { length: 40 }).default(sql.raw("''")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "post_mail_PRIMARY", columns: [table["uid"]] }),
  index("post_mail_index_toUserTime").on(sql.raw("\"toUser\""), sql.raw("\"createTime\"")),
  check("post_mail_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
]);
