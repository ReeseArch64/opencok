import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const dragon_tower_user = cokdb1.table("dragon_tower_user", {
  "uid": varchar("uid", { length: 32 }).notNull(),
  "currentlayer": integer("currentlayer"),
  "weeklymaxlayer": integer("weeklymaxlayer"),
  "maxlayer": integer("maxlayer"),
  "weeklyrevive": smallint("weeklyrevive"),
  "resettimes": smallint("resettimes"),
  "dailyresettime": bigint("dailyresettime", { mode: "bigint" }),
  "weeklyresettime": bigint("weeklyresettime", { mode: "bigint" }),
  "dragon": varchar("dragon", { length: 36 }),
  "army": text("army"),
  "deadarmy": text("deadarmy"),
  "armyrevivenum": integer("armyrevivenum"),
  "armyrevive": text("armyrevive"),
  "armyrevivecd": bigint("armyrevivecd", { mode: "bigint" }),
  "score": integer("score"),
  "sharetimes": smallint("sharetimes"),
  "generalid": integer("generalid").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "dragon_tower_user_PRIMARY", columns: [table["uid"]] }),
]);
