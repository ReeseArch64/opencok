// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_words_record = cokdb1.table("dragon_words_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "castleLevel": integer("castleLevel").notNull(),
  "loadLevel": integer("loadLevel").notNull(),
  "buildingLevel": integer("buildingLevel").notNull(),
  "activityTitle": integer("activityTitle").notNull(),
  "talismanDetail": legacyText("talismanDetail", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "dragon_words_record_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("dragon_words_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("dragon_words_record_dragon_words_record_index").on(sql.raw("\"castleLevel\""), sql.raw("\"buildingLevel\"")),
]);
