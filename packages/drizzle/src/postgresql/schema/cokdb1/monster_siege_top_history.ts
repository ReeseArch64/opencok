// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const monster_siege_top_history = cokdb1.table("monster_siege_top_history", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "allianceAbbr": legacyText("allianceAbbr", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "rank": integer("rank").notNull(),
  "killCount": bigint("killCount", { mode: "bigint" }).default(sql.raw("0")),
  "siegeRound": integer("siegeRound").default(sql.raw("0")),
  "validMemberCount": integer("validMemberCount").default(sql.raw("0")),
  "allianceCount": integer("allianceCount").default(sql.raw("0")),
  "activityAllianceCount": integer("activityAllianceCount").default(sql.raw("0")),
  "activity30AllianceCount": integer("activity30AllianceCount").default(sql.raw("0")),
  "activity40AllianceCount": integer("activity40AllianceCount").default(sql.raw("0")),
  "activity50AllianceCount": integer("activity50AllianceCount").default(sql.raw("0")),
  "monsterPerRoundNum": legacyText("monsterPerRoundNum", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "monster_siege_top_history_PRIMARY", columns: [table["allianceId"], table["time"]] }),
  uniqueIndex("monster_siege_top_history_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\""), sql.raw("\"time\"")),
]);
