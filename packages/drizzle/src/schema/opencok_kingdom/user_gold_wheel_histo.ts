import { sql } from "drizzle-orm";
import { bigint, check, index, integer, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_gold_wheel_histo = opencok_kingdom.table(
  "user_gold_wheel_histo",
  {
    "uid": varchar("uid", { length: 50 }).notNull(),
    "normal_free": integer("normal_free").notNull().default(sql.raw("0")),
    "normal_total": integer("normal_total").notNull().default(sql.raw("0")),
    "silver_usable": integer("silver_usable").notNull().default(sql.raw("0")),
    "silver_usable_free": integer("silver_usable_free").notNull().default(sql.raw("0")),
    "silver_daily": integer("silver_daily").notNull().default(sql.raw("0")),
    "silver_total": integer("silver_total").notNull().default(sql.raw("0")),
    "silver_last_add_millis": bigint("silver_last_add_millis", { mode: "bigint" })
      .notNull()
      .default(sql.raw("0")),
    "gold_daily": integer("gold_daily").notNull().default(sql.raw("0")),
    "gold_usable": integer("gold_usable").notNull().default(sql.raw("0")),
    "gold_total": integer("gold_total").notNull().default(sql.raw("0")),
    "gold_last_add_millis": bigint("gold_last_add_millis", { mode: "bigint" })
      .notNull()
      .default(sql.raw("0")),
    "last_normal_wheel_millis": bigint("last_normal_wheel_millis", { mode: "bigint" })
      .notNull()
      .default(sql.raw("0")),
    "create_time": text("create_time").notNull(),
  },
  (_table) => [
    index("user_gold_wheel_histo_uid").on(sql.raw('"uid"')),
    check(
      "user_gold_wheel_histo_create_time_temporal",
      sql.raw(
        '("create_time" IS NULL OR (CASE WHEN "create_time" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$\' THEN CASE WHEN left("create_time",4) <> \'0000\' AND substring("create_time",6,2) <> \'00\' AND substring("create_time",9,2) <> \'00\' THEN to_char(to_date(left("create_time",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("create_time",10) ELSE true END ELSE false END))',
      ),
    ),
  ],
);
