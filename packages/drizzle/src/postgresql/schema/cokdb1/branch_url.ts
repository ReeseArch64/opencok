// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const branch_url = cokdb1.table("branch_url", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "serverId": integer("serverId").notNull().default(sql.raw("0")),
  "type": legacyText("type", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "data": legacyText("data", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "url": legacyText("url", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "startTime": bigint("startTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "modifyTime": bigint("modifyTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "branch_url_PRIMARY", columns: [table["uid"], table["serverId"], table["url"]] }),
  uniqueIndex("branch_url_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"serverId\""), sql.raw("rtrim(\"url\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("branch_url_branch_url_link_index").on(sql.raw("rtrim(\"url\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("branch_url_branch_url_type_index").on(sql.raw("rtrim(\"type\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
