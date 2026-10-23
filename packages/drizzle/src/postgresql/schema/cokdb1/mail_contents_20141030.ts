// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mail_contents_20141030 = cokdb1.table("mail_contents_20141030", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "title": legacyText("title", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "contents": legacyBytes("contents").notNull(),
  "rewardId": legacyBytes("rewardId"),
  "itemIdFlag": integer("itemIdFlag").default(sql.raw("0")),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "mail_contents_20141030_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("mail_contents_20141030_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("mail_contents_20141030_contents_length", sql.raw("octet_length(\"contents\") <= 65535")),
  check("mail_contents_20141030_rewardId_length", sql.raw("octet_length(\"rewardId\") <= 65535")),
]);
