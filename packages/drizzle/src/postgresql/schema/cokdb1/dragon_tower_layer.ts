// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_tower_layer = cokdb1.table("dragon_tower_layer", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "layer": integer("layer").notNull(),
  "difficulty": smallint("difficulty"),
  "monsters": legacyText("monsters", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}),
  "currentmonster": integer("currentmonster"),
  "buff": legacyText("buff", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}),
  "buybuff": integer("buybuff"),
  "awards": legacyText("awards", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "awardstate": smallint("awardstate"),
  "layerstate": smallint("layerstate"),
  "fighttime": bigint("fighttime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "dragon_tower_layer_PRIMARY", columns: [table["uid"], table["layer"]] }),
  uniqueIndex("dragon_tower_layer_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"layer\"")),
  index("dragon_tower_layer_Index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("dragon_tower_layer_difficulty_range", sql.raw("\"difficulty\" BETWEEN -128 AND 127")),
  check("dragon_tower_layer_awardstate_range", sql.raw("\"awardstate\" BETWEEN -128 AND 127")),
  check("dragon_tower_layer_layerstate_range", sql.raw("\"layerstate\" BETWEEN -128 AND 127")),
]);
