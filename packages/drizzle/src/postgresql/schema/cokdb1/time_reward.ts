// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const time_reward = cokdb1.table("time_reward", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "rewardId": legacyText("rewardId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }),
  "nextRewardTime": bigint("nextRewardTime", { mode: "bigint" }),
  "count": integer("count"),
}, (table) => [
  primaryKey({ name: "time_reward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("time_reward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
