import { sql } from "drizzle-orm";
import { check, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_playoff_properties = opencok_kingdom.table(
  "dragon_playoff_properties",
  {
    "key": varchar("key", { length: 100 }).notNull(),
    "value": varchar("value", { length: 1000 }),
    "updateTime": text("updateTime")
      .notNull()
      .default(
        sql.raw("to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')"),
      )
      .$onUpdateFn(() =>
        sql.raw("to_char(statement_timestamp() AT TIME ZONE 'UTC', 'YYYY-MM-DD HH24:MI:SS')"),
      ),
  },
  (table) => [
    primaryKey({ name: "dragon_playoff_properties_PRIMARY", columns: [table["key"]] }),
    check(
      "dragon_playoff_properties_updateTime_temporal",
      sql.raw(
        '("updateTime" IS NULL OR (CASE WHEN "updateTime" ~ \'^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$\' THEN CASE WHEN left("updateTime",4) <> \'0000\' AND substring("updateTime",6,2) <> \'00\' AND substring("updateTime",9,2) <> \'00\' THEN to_char(to_date(left("updateTime",10),\'YYYY-MM-DD\'),\'YYYY-MM-DD\') = left("updateTime",10) ELSE true END ELSE false END))',
      ),
    ),
  ],
);
