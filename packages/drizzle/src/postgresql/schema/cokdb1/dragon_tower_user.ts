// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_tower_user = cokdb1.table("dragon_tower_user", {
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "currentlayer": integer("currentlayer"),
  "weeklymaxlayer": integer("weeklymaxlayer"),
  "maxlayer": integer("maxlayer"),
  "weeklyrevive": smallint("weeklyrevive"),
  "resettimes": smallint("resettimes"),
  "dailyresettime": bigint("dailyresettime", { mode: "bigint" }),
  "weeklyresettime": bigint("weeklyresettime", { mode: "bigint" }),
  "dragon": legacyText("dragon", {"sqlType":"character varying(36)","collation":"legacy_meta.ci"}),
  "army": legacyText("army", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "deadarmy": legacyText("deadarmy", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "armyrevivenum": integer("armyrevivenum"),
  "armyrevive": legacyText("armyrevive", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "armyrevivecd": bigint("armyrevivecd", { mode: "bigint" }),
  "score": integer("score"),
  "sharetimes": smallint("sharetimes"),
  "generalid": integer("generalid").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "dragon_tower_user_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("dragon_tower_user_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
