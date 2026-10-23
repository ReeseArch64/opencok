// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_boss = cokdb1.table("alliance_boss", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemNum": integer("itemNum").default(sql.raw("0")),
  "bossLevel": legacyText("bossLevel", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "todayCount": integer("todayCount").default(sql.raw("0")),
  "lastChallengeTime": bigint("lastChallengeTime", { mode: "bigint" }).default(sql.raw("0")),
  "bossId": legacyText("bossId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "maxHp": integer("maxHp").default(sql.raw("0")),
  "hp": integer("hp").default(sql.raw("0")),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "power": integer("power").default(sql.raw("0")),
  "rewards": legacyText("rewards", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "pointId": integer("pointId").default(sql.raw("0")),
  "attackerNum": integer("attackerNum").default(sql.raw("0")),
  "attackTimes": integer("attackTimes").default(sql.raw("0")),
  "killUser": legacyText("killUser", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "lastHurt": integer("lastHurt").default(sql.raw("0")),
  "userAttackInfo": legacyText("userAttackInfo", {"sqlType":"text","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "alliance_boss_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_boss_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
