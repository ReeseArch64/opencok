import { bigint, integer, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const dragon_tower_fightreport = cokdb1.table("dragon_tower_fightreport", {
  "citylevel": smallint("citylevel").notNull(),
  "layer": integer("layer").notNull(),
  "uid": varchar("uid", { length: 32 }),
  "fighttime": bigint("fighttime", { mode: "bigint" }),
  "army": text("army"),
  "report": text("report"),
  "citystar": smallint("citystar"),
  "monsterid": integer("monsterid"),
  "difficulty": smallint("difficulty"),
  "monsterdead": integer("monsterdead"),
  "playerdead": integer("playerdead"),
}, (table) => [
  primaryKey({ name: "dragon_tower_fightreport_PRIMARY", columns: [table["citylevel"], table["layer"]] }),
]);
