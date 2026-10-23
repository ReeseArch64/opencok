// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const monster_siege = cokdb1.table("monster_siege", {
  "allianceId": legacyText("allianceId", {"sqlType":"character varying(40)","collation":"C"}).notNull(),
  "monsterCastleId": integer("monsterCastleId").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "currPhase": integer("currPhase").default(sql.raw("0")),
  "currRoundIndex": integer("currRoundIndex").default(sql.raw("0")),
  "currRoundStartTime": bigint("currRoundStartTime", { mode: "bigint" }).default(sql.raw("0")),
  "currmemberUidListInfo": legacyText("currmemberUidListInfo", {"sqlType":"character varying(4000)","collation":"C"}),
  "memberUidListInfo": legacyText("memberUidListInfo", {"sqlType":"character varying(4000)","collation":"C"}),
  "allianceKillCount": bigint("allianceKillCount", { mode: "bigint" }).default(sql.raw("0")),
  "currMonsterInfo": legacyText("currMonsterInfo", {"sqlType":"character varying(4000)","collation":"C"}),
  "monsterCastleIds": legacyText("monsterCastleIds", {"sqlType":"character varying(400)","collation":"C"}),
  "monsterPerRoundNum": legacyText("monsterPerRoundNum", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "monster_siege_PRIMARY", columns: [table["allianceId"]] }),
  uniqueIndex("monster_siege_PRIMARY_pad").on(sql.raw("rtrim(\"allianceId\", ' ') COLLATE \"C\"")),
]);
