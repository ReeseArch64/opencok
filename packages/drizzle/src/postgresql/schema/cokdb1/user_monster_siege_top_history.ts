// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_monster_siege_top_history = cokdb1.table("user_monster_siege_top_history", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "allianceAbbr": legacyText("allianceAbbr", {"sqlType":"character varying(40)","collation":"C"}),
  "allianceName": legacyText("allianceName", {"sqlType":"character varying(40)","collation":"C"}),
  "rank": integer("rank").notNull(),
  "killCount": bigint("killCount", { mode: "bigint" }).default(sql.raw("0")),
  "failRounds": legacyText("failRounds", {"sqlType":"character varying(100)","collation":"C"}),
}, (table) => [
  primaryKey({ name: "user_monster_siege_top_history_PRIMARY", columns: [table["uid"], table["time"]] }),
  uniqueIndex("user_monster_siege_top_history_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("\"time\"")),
]);
