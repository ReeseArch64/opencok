import { sql } from "drizzle-orm";
import { index, integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const server_mail_record = cokdb1.table("server_mail_record", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "record": varchar("record", { length: 40 }).notNull(),
  "state": integer("state").default(sql.raw("0")),
}, (_table) => [
  index("server_mail_record_index_uid").on(sql.raw("\"uid\""), sql.raw("\"record\""), sql.raw("\"state\"")),
  index("server_mail_record_index_record").on(sql.raw("\"record\""), sql.raw("\"state\"")),
]);
