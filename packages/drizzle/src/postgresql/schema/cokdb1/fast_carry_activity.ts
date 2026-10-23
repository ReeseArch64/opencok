// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const fast_carry_activity = cokdb1.table("fast_carry_activity", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": legacyText("type", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'17'")),
  "totalPoint": integer("totalPoint").notNull().default(sql.raw("0")),
  "lastEndTime": bigint("lastEndTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "reward1": legacyText("reward1", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'-1'")),
  "reward2": legacyText("reward2", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'-1'")),
  "reward3": legacyText("reward3", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'-1'")),
  "reward4": legacyText("reward4", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'-1'")),
  "goalReward1": integer("goalReward1").notNull().default(sql.raw("0")),
  "goalReward2": integer("goalReward2").notNull().default(sql.raw("0")),
  "goalReward3": integer("goalReward3").notNull().default(sql.raw("0")),
  "goalReward4": integer("goalReward4").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "fast_carry_activity_PRIMARY", columns: [table["uid"], table["lastEndTime"]] }),
  uniqueIndex("fast_carry_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastEndTime\"")),
  index("fast_carry_activity_goalReward").on(sql.raw("\"goalReward1\""), sql.raw("\"goalReward2\""), sql.raw("\"goalReward3\""), sql.raw("\"goalReward4\"")),
]);
