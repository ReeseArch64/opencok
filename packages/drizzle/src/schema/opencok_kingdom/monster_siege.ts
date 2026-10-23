import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const monster_siege = opencok_kingdom.table("monster_siege", {
  "allianceId": varchar("allianceId", { length: 40 }).notNull(),
  "monsterCastleId": integer("monsterCastleId").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
  "currPhase": integer("currPhase").default(sql.raw("0")),
  "currRoundIndex": integer("currRoundIndex").default(sql.raw("0")),
  "currRoundStartTime": bigint("currRoundStartTime", { mode: "bigint" }).default(sql.raw("0")),
  "currmemberUidListInfo": varchar("currmemberUidListInfo", { length: 4000 }),
  "memberUidListInfo": varchar("memberUidListInfo", { length: 4000 }),
  "allianceKillCount": bigint("allianceKillCount", { mode: "bigint" }).default(sql.raw("0")),
  "currMonsterInfo": varchar("currMonsterInfo", { length: 4000 }),
  "monsterCastleIds": varchar("monsterCastleIds", { length: 400 }),
  "monsterPerRoundNum": varchar("monsterPerRoundNum", { length: 500 }),
}, (table) => [
  primaryKey({ name: "monster_siege_PRIMARY", columns: [table["allianceId"]] }),
]);
