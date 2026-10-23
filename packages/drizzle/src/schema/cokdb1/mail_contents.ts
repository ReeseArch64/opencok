import { sql } from "drizzle-orm";
import { check, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const mail_contents = cokdb1.table("mail_contents", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "contents": bytea("contents").notNull(),
  "toUser": varchar("toUser", { length: 40 }).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "mail_contents_PRIMARY", columns: [table["uid"]] }),
  index("mail_contents_user_idx").on(sql.raw("\"toUser\"")),
  check("mail_contents_contents_length", sql.raw("octet_length(\"contents\") <= 16777215")),
]);
