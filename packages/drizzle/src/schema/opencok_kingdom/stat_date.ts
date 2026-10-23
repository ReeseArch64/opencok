import { sql } from "drizzle-orm";
import { check, integer, numeric, primaryKey, text } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const stat_date = opencok_kingdom.table(
  "stat_date",
  {
    "date": text("date").notNull(),
    "dau": integer("dau").notNull().default(sql.raw("0")),
    "pay": numeric("pay", { precision: 12, scale: 2, mode: "number" })
      .notNull()
      .default(sql.raw("0.00")),
    "reg": integer("reg").notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "stat_date_PRIMARY", columns: [table["date"]] }),
    check(
      "stat_date_date_temporal",
      sql.raw(
        '("date" IS NULL OR (CASE WHEN "date" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01])$\' THEN CASE WHEN left("date",4) <> \'0000\' AND substring("date",6,2) <> \'00\' AND substring("date",9,2) <> \'00\' THEN to_char(to_date(left("date",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("date",10) ELSE true END ELSE false END))',
      ),
    ),
  ],
);
