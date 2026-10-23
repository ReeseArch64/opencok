// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pay_order_count_log = cokdb1.table("pay_order_count_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "className": legacyText("className", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "action": integer("action").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (_table) => [
  index("pay_order_count_log_index_time").on(sql.raw("\"time\"")),
  index("pay_order_count_log_index_uid_class").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"className\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
