import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const usermapping = opencok_global.table(
  "usermapping",
  {
    "gameUid": varchar("gameUid", { length: 100 }).notNull(),
    "mappingType": varchar("mappingType", { length: 20 }).notNull().default(sql.raw("''")),
    "mappingValue": varchar("mappingValue", { length: 200 }),
    "lastTime": bigint("lastTime", { mode: "bigint" }).default(sql.raw("0")),
    "active": integer("active").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "usermapping_PRIMARY", columns: [table["gameUid"], table["mappingType"]] }),
    index("usermapping_pf_pi_lasttime_index").on(
      sql.raw('"mappingType"'),
      sql.raw('"mappingValue"'),
      sql.raw('"lastTime"'),
    ),
  ],
);
