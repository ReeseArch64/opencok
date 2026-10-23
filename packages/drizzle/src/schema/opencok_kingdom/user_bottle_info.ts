import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_bottle_info = opencok_kingdom.table(
  "user_bottle_info",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "throwRemainCount": integer("throwRemainCount").notNull().default(sql.raw("0")),
    "pickRemainCount": integer("pickRemainCount").notNull().default(sql.raw("0")),
    "myBottleNum": integer("myBottleNum").notNull().default(sql.raw("0")),
    "lastClearTime": bigint("lastClearTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "pickBottlesUidsByteArray": bytea("pickBottlesUidsByteArray"),
  },
  (table) => [
    primaryKey({ name: "user_bottle_info_PRIMARY", columns: [table["uid"]] }),
    check(
      "user_bottle_info_pickBottlesUidsByteArray_length",
      sql.raw('octet_length("pickBottlesUidsByteArray") <= 65535'),
    ),
  ],
);
