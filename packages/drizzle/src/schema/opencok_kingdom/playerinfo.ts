import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const playerinfo = opencok_kingdom.table(
  "playerinfo",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "battlesWin": integer("battlesWin").default(sql.raw("0")),
    "battlesLose": integer("battlesLose").default(sql.raw("0")),
    "attacksWin": integer("attacksWin").default(sql.raw("0")),
    "attacksLose": integer("attacksLose").default(sql.raw("0")),
    "defensesWin": integer("defensesWin").default(sql.raw("0")),
    "detectNum": integer("detectNum").default(sql.raw("0")),
    "armyKill": bigint("armyKill", { mode: "bigint" }).default(sql.raw("0")),
    "armyDead": integer("armyDead").default(sql.raw("0")),
    "armyCure": integer("armyCure").default(sql.raw("0")),
    "cityDestroyed": integer("cityDestroyed").default(sql.raw("0")),
    "questPower": integer("questPower").default(sql.raw("0")),
    "power": bigint("power", { mode: "bigint" }).default(sql.raw("0")),
    "buildingPower": bigint("buildingPower", { mode: "bigint" }).default(sql.raw("0")),
    "is_reward": varchar("is_reward", { length: 255 }).notNull().default(sql.raw("'N'")),
  },
  (table) => [
    primaryKey({ name: "playerinfo_PRIMARY", columns: [table["uid"]] }),
    index("playerinfo_power_index").on(sql.raw('"power"')),
  ],
);
