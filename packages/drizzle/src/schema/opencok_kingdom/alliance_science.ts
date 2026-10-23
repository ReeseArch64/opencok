import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const alliance_science = opencok_kingdom.table("alliance_science", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "scienceId": integer("scienceId").notNull(),
  "level": integer("level"),
  "wood": integer("wood"),
  "stone": integer("stone"),
  "iron": integer("iron"),
  "food": integer("food"),
  "silver": integer("silver"),
  "gold": integer("gold"),
  "donateprogress": integer("donateprogress").default(sql.raw("0")),
  "donatefinish": integer("donatefinish").default(sql.raw("0")),
  "researchstarttime": bigint("researchstarttime", { mode: "bigint" }).default(sql.raw("0")),
  "effectflag": integer("effectflag").default(sql.raw("0")),
  "power": integer("power").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "alliance_science_PRIMARY", columns: [table["allianceId"], table["scienceId"]] }),
  index("alliance_science_index_alliance").on(sql.raw("\"allianceId\"")),
]);
