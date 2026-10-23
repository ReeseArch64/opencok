// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_playoff_teaminfo = cokdb1.table("dragon_playoff_teaminfo", {
  "teamId": legacyText("teamId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "teamName": legacyText("teamName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "leaderName": legacyText("leaderName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingId": integer("kingId").notNull().default(sql.raw("0")),
  "kingName": legacyText("kingName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "state": integer("state").notNull().default(sql.raw("0")),
  "score": integer("score").notNull().default(sql.raw("0")),
  "fighting": integer("fighting").notNull().default(sql.raw("0")),
  "fightNum": integer("fightNum").notNull().default(sql.raw("0")),
  "winNum": integer("winNum").notNull().default(sql.raw("0")),
  "curmember": integer("curmember").notNull().default(sql.raw("0")),
  "maxmember": integer("maxmember").notNull().default(sql.raw("0")),
  "version": integer("version").notNull().default(sql.raw("0")),
  "index": integer("index").notNull().default(sql.raw("0")),
  "fightServerId": legacyText("fightServerId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "rankNum": integer("rankNum").notNull().default(sql.raw("0")),
  "areaId": integer("areaId").notNull().default(sql.raw("0")),
  "abbr": legacyText("abbr", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "fightState": integer("fightState").notNull().default(sql.raw("0")),
  "serverId": integer("serverId").notNull().default(sql.raw("0")),
  "icon": legacyText("icon", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "groupId": integer("groupId").notNull().default(sql.raw("0")),
  "groupIndex": integer("groupIndex").notNull().default(sql.raw("0")),
  "timeIndexes": legacyText("timeIndexes", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "enemyIds": legacyText("enemyIds", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "results": legacyText("results", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "curEnemyId": legacyText("curEnemyId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "finalGroupIndex": integer("finalGroupIndex").notNull().default(sql.raw("0")),
  "finalRankNum": integer("finalRankNum").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "dragon_playoff_teaminfo_PRIMARY", columns: [table["teamId"], table["version"]] }),
  uniqueIndex("dragon_playoff_teaminfo_PRIMARY_pad").on(sql.raw("rtrim(\"teamId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"version\"")),
]);
