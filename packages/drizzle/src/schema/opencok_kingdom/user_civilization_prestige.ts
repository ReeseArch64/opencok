import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_civilization_prestige = opencok_kingdom.table("user_civilization_prestige", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "civilizationType": integer("civilizationType").notNull(),
  "prestigeValue": bigint("prestigeValue", { mode: "bigint" }).default(sql.raw("0")),
  "periodicLimitValue": integer("periodicLimitValue").default(sql.raw("0")),
  "updateTime": bigint("updateTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardLv": integer("rewardLv").default(sql.raw("0")),
  "actionLimits": varchar("actionLimits", { length: 3000 }),
}, (table) => [
  primaryKey({ name: "user_civilization_prestige_PRIMARY", columns: [table["uid"], table["civilizationType"]] }),
]);
