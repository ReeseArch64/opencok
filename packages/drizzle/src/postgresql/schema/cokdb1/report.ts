// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const report = cokdb1.table("report", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
  "report": legacyBytes("report").notNull(),
}, (table) => [
  primaryKey({ name: "report_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("report_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("report_index_time").on(sql.raw("\"createTime\"")),
  check("report_report_length", sql.raw("octet_length(\"report\") <= 16777215")),
]);
