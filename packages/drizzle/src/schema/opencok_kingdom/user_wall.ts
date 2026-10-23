import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_wall = opencok_kingdom.table(
  "user_wall",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "armyId": varchar("armyId", { length: 20 }).notNull(),
    "num": integer("num").notNull().default(sql.raw("0")),
    "build": integer("build").notNull().default(sql.raw("0")),
    "finishTime": bigint("finishTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "level": integer("level").notNull(),
  },
  (table) => [primaryKey({ name: "user_wall_PRIMARY", columns: [table["uid"], table["armyId"]] })],
);
