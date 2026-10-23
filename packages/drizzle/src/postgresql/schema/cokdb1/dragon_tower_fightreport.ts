// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, integer, primaryKey, smallint } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_tower_fightreport = cokdb1.table("dragon_tower_fightreport", {
  "citylevel": smallint("citylevel").notNull(),
  "layer": integer("layer").notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}),
  "fighttime": bigint("fighttime", { mode: "bigint" }),
  "army": legacyText("army", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "report": legacyText("report", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "citystar": smallint("citystar"),
  "monsterid": integer("monsterid"),
  "difficulty": smallint("difficulty"),
  "monsterdead": integer("monsterdead"),
  "playerdead": integer("playerdead"),
}, (table) => [
  primaryKey({ name: "dragon_tower_fightreport_PRIMARY", columns: [table["citylevel"], table["layer"]] }),
]);
