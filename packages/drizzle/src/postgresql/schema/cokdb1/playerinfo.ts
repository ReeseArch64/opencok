// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const playerinfo = cokdb1.table("playerinfo", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "battlesWin": integer("battlesWin").default(sql.raw("0")),
  "battlesLose": integer("battlesLose").default(sql.raw("0")),
  "attacksWin": integer("attacksWin").default(sql.raw("0")),
  "attacksLose": integer("attacksLose").default(sql.raw("0")),
  "defensesWin": integer("defensesWin").default(sql.raw("0")),
  "detectNum": integer("detectNum").default(sql.raw("0")),
  "armyKill": bigint("armyKill", { mode: "bigint" }).default(sql.raw("0")),
  "armyDead": integer("armyDead").default(sql.raw("0")),
  "armyCure": integer("armyCure").default(sql.raw("0")),
  "cityDestroyed": integer("cityDestroyed").default(sql.raw("0")),
  "questPower": integer("questPower").default(sql.raw("0")),
  "power": bigint("power", { mode: "bigint" }).default(sql.raw("0")),
  "buildingPower": bigint("buildingPower", { mode: "bigint" }).default(sql.raw("0")),
  "is_reward": legacyText("is_reward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'N'")),
}, (table) => [
  primaryKey({ name: "playerinfo_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("playerinfo_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("playerinfo_power_index").on(sql.raw("\"power\"")),
]);
