import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, text, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_tower_layer = opencok_kingdom.table("dragon_tower_layer", {
  "uid": varchar("uid", { length: 32 }).notNull(),
  "layer": integer("layer").notNull(),
  "difficulty": smallint("difficulty"),
  "monsters": varchar("monsters", { length: 36 }),
  "currentmonster": integer("currentmonster"),
  "buff": varchar("buff", { length: 36 }),
  "buybuff": integer("buybuff"),
  "awards": text("awards"),
  "awardstate": smallint("awardstate"),
  "layerstate": smallint("layerstate"),
  "fighttime": bigint("fighttime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "dragon_tower_layer_PRIMARY", columns: [table["uid"], table["layer"]] }),
  index("dragon_tower_layer_Index_uid").on(sql.raw("\"uid\"")),
  check("dragon_tower_layer_difficulty_range", sql.raw("\"difficulty\" BETWEEN -128 AND 127")),
  check("dragon_tower_layer_awardstate_range", sql.raw("\"awardstate\" BETWEEN -128 AND 127")),
  check("dragon_tower_layer_layerstate_range", sql.raw("\"layerstate\" BETWEEN -128 AND 127")),
]);
