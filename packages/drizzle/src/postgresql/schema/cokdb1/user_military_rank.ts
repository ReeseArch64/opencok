// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_military_rank = cokdb1.table("user_military_rank", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "militaryScore": legacyNumber("militaryScore", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "honor": legacyNumber("honor", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "rankingExp": integer("rankingExp").notNull(),
  "militaryRank": integer("militaryRank").notNull(),
  "award": legacyText("award", {"sqlType":"character varying(500)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "lastRanking": integer("lastRanking").default(sql.raw("0")),
  "lastMilitaryScore": legacyNumber("lastMilitaryScore", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "skill": legacyText("skill", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "status": integer("status").notNull().default(sql.raw("1")),
  "lastTimeSet0Tostatus": bigint("lastTimeSet0Tostatus", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "awardReceived": integer("awardReceived").notNull().default(sql.raw("1")),
  "lastTimeReset": bigint("lastTimeReset", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "maxHonorWeekly": legacyNumber("maxHonorWeekly", {"sqlType":"numeric(11,2)"}).default(sql.raw("0.00")),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_military_rank_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_military_rank_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_military_rank_index_militaryScore").on(sql.raw("\"militaryScore\"")),
  index("user_military_rank_index_rankingExp").on(sql.raw("\"rankingExp\"")),
]);
