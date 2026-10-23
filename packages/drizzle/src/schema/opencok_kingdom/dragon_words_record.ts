import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const dragon_words_record = opencok_kingdom.table("dragon_words_record", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "castleLevel": integer("castleLevel").notNull(),
  "loadLevel": integer("loadLevel").notNull(),
  "buildingLevel": integer("buildingLevel").notNull(),
  "activityTitle": integer("activityTitle").notNull(),
  "talismanDetail": varchar("talismanDetail", { length: 1024 }),
}, (table) => [
  primaryKey({ name: "dragon_words_record_PRIMARY", columns: [table["uid"]] }),
  index("dragon_words_record_dragon_words_record_index").on(sql.raw("\"castleLevel\""), sql.raw("\"buildingLevel\"")),
]);
