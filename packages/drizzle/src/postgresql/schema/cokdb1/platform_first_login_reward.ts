// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const platform_first_login_reward = cokdb1.table("platform_first_login_reward", {
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "hasReward": integer("hasReward").notNull().default(sql.raw("0")),
  "pf": legacyText("pf", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "platform_first_login_reward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("platform_first_login_reward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
