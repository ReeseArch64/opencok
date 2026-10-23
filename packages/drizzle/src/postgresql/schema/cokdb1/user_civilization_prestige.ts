// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_civilization_prestige = cokdb1.table("user_civilization_prestige", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "civilizationType": integer("civilizationType").notNull(),
  "prestigeValue": bigint("prestigeValue", { mode: "bigint" }).default(sql.raw("0")),
  "periodicLimitValue": integer("periodicLimitValue").default(sql.raw("0")),
  "updateTime": bigint("updateTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardLv": integer("rewardLv").default(sql.raw("0")),
  "actionLimits": legacyText("actionLimits", {"sqlType":"character varying(3000)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_civilization_prestige_PRIMARY", columns: [table["uid"], table["civilizationType"]] }),
  uniqueIndex("user_civilization_prestige_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"civilizationType\"")),
]);
