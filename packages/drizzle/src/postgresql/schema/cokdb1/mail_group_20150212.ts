// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mail_group_20150212 = cokdb1.table("mail_group_20150212", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "groupType": integer("groupType").notNull().default(sql.raw("1")),
  "groupIndex": legacyText("groupIndex", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "updateTime": bigint("updateTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "mail_group_20150212_PRIMARY", columns: [table["uid"], table["groupType"], table["groupIndex"]] }),
  uniqueIndex("mail_group_20150212_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"groupType\""), sql.raw("rtrim(\"groupIndex\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
