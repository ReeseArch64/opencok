// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_gold_wheel_histo = cokdb1.table("user_gold_wheel_histo", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "normal_free": integer("normal_free").notNull().default(sql.raw("0")),
  "normal_total": integer("normal_total").notNull().default(sql.raw("0")),
  "silver_usable": integer("silver_usable").notNull().default(sql.raw("0")),
  "silver_usable_free": integer("silver_usable_free").notNull().default(sql.raw("0")),
  "silver_daily": integer("silver_daily").notNull().default(sql.raw("0")),
  "silver_total": integer("silver_total").notNull().default(sql.raw("0")),
  "silver_last_add_millis": bigint("silver_last_add_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "gold_daily": integer("gold_daily").notNull().default(sql.raw("0")),
  "gold_usable": integer("gold_usable").notNull().default(sql.raw("0")),
  "gold_total": integer("gold_total").notNull().default(sql.raw("0")),
  "gold_last_add_millis": bigint("gold_last_add_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "last_normal_wheel_millis": bigint("last_normal_wheel_millis", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "create_time": legacyTemporal("create_time").notNull(),
}, (_table) => [
  index("user_gold_wheel_histo_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_gold_wheel_histo_create_time_temporal", sql.raw("legacy_meta.valid_temporal(\"create_time\", 'datetime', 0)")),
]);
