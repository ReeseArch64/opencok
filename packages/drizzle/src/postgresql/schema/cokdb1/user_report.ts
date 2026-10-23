// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_report = cokdb1.table("user_report", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "target_uid": legacyText("target_uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (_table) => [
  index("user_report_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_report_target_uid").on(sql.raw("rtrim(\"target_uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_report_time").on(sql.raw("\"time\"")),
]);
