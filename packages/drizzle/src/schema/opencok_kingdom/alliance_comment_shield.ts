import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_comment_shield = opencok_kingdom.table(
  "alliance_comment_shield",
  {
    "uuid": varchar("uuid", { length: 40 }).notNull(),
    "allianceId": varchar("allianceId", { length: 40 }),
    "type": integer("type"),
    "icon": varchar("icon", { length: 10 }),
    "abbr": varchar("abbr", { length: 10 }),
    "name": varchar("name", { length: 40 }),
  },
  (table) => [
    primaryKey({ name: "alliance_comment_shield_PRIMARY", columns: [table["uuid"]] }),
    index("alliance_comment_shield_index_allianceId").on(sql.raw('"allianceId"')),
  ],
);
