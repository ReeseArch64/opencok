import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const t_worldbossinfo = opencok_kingdom.table(
  "t_worldbossinfo",
  {
    "id": varchar("id", { length: 36 }).notNull(),
    "bossid": integer("bossid"),
    "level": smallint("level"),
    "type": smallint("type"),
    "weeklyresettime": bigint("weeklyresettime", { mode: "bigint" }),
    "weeklytimes": smallint("weeklytimes"),
    "dailyresettime": bigint("dailyresettime", { mode: "bigint" }),
    "dailytimes": smallint("dailytimes"),
  },
  (table) => [
    primaryKey({ name: "t_worldbossinfo_PRIMARY", columns: [table["id"]] }),
    check("t_worldbossinfo_type_range", sql.raw('"type" BETWEEN -128 AND 127')),
  ],
);
