// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const function_notice = cokdb1.table("function_notice", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "noticeMapStr": legacyText("noticeMapStr", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "function_notice_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("function_notice_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
