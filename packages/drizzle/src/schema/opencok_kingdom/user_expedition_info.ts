import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_expedition_info = opencok_kingdom.table(
  "user_expedition_info",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "recieveResource": bigint("recieveResource", { mode: "bigint" })
      .notNull()
      .default(sql.raw("0")),
    "lastClearTime": bigint("lastClearTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "isTakeAward1": smallint("isTakeAward1").notNull().default(sql.raw("0")),
    "isTakeAward2": smallint("isTakeAward2").notNull().default(sql.raw("0")),
    "isTakeAward3": smallint("isTakeAward3").notNull().default(sql.raw("0")),
    "takeTime1": bigint("takeTime1", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "takeTime2": bigint("takeTime2", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "takeTime3": bigint("takeTime3", { mode: "bigint" }).notNull().default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "user_expedition_info_PRIMARY", columns: [table["uid"]] }),
    check(
      "user_expedition_info_isTakeAward1_range",
      sql.raw('"isTakeAward1" BETWEEN -128 AND 127'),
    ),
    check(
      "user_expedition_info_isTakeAward2_range",
      sql.raw('"isTakeAward2" BETWEEN -128 AND 127'),
    ),
    check(
      "user_expedition_info_isTakeAward3_range",
      sql.raw('"isTakeAward3" BETWEEN -128 AND 127'),
    ),
  ],
);
