// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const bottles = cokdb1.table("bottles", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "serverId": integer("serverId").notNull(),
  "pic": legacyText("pic", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "content": legacyBytes("content").notNull(),
  "locked": smallint("locked").notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "replyCount": integer("replyCount").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "bottles_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("bottles_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("bottles_uid_index").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("bottles_content_length", sql.raw("octet_length(\"content\") <= 65535")),
  check("bottles_locked_range", sql.raw("\"locked\" BETWEEN -128 AND 127")),
]);
