// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ad_reward = cokdb1.table("ad_reward", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "type": legacyText("type", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "device": legacyText("device", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "time": bigint("time", { mode: "bigint" }),
  "state": integer("state"),
  "location": legacyText("location", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "dplink_type": integer("dplink_type").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "ad_reward_PRIMARY", columns: [table["uid"], table["type"], table["dplink_type"]] }),
  uniqueIndex("ad_reward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"type\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"dplink_type\"")),
  index("ad_reward_index_time").on(sql.raw("\"time\"")),
]);
