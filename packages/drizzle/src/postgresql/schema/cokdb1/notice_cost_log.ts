// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const notice_cost_log = cokdb1.table("notice_cost_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": smallint("type"),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "cost": integer("cost"),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "notice_cost_log_PRIMARY", columns: [table["uid"], table["itemId"], table["createTime"]] }),
  uniqueIndex("notice_cost_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
  check("notice_cost_log_type_range", sql.raw("\"type\" BETWEEN -128 AND 127")),
]);
