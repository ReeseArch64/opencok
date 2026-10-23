import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const bottles = cokdb1.table("bottles", {
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "name": varchar("name", { length: 255 }).notNull(),
  "serverId": integer("serverId").notNull(),
  "pic": varchar("pic", { length: 40 }),
  "content": bytea("content").notNull(),
  "locked": smallint("locked").notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "replyCount": integer("replyCount").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "bottles_PRIMARY", columns: [table["uuid"]] }),
  index("bottles_uid_index").on(sql.raw("\"uid\"")),
  check("bottles_content_length", sql.raw("octet_length(\"content\") <= 65535")),
  check("bottles_locked_range", sql.raw("\"locked\" BETWEEN -128 AND 127")),
]);
