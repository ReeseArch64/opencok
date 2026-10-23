// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_science = cokdb1.table("alliance_science", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
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
  uniqueIndex("alliance_science_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"scienceId\"")),
  index("alliance_science_index_alliance").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
