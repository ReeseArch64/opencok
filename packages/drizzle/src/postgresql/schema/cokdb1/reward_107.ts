// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const reward_107 = cokdb1.table("reward_107", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "version": legacyText("version", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "sid": integer("sid").default(sql.raw("0")),
  "107uid": legacyText("107uid", {"sqlType":"character varying(255)","collation":"C"}),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"C"}),
  "rewardLevel": integer("rewardLevel").default(sql.raw("0")),
  "rewardStatus": integer("rewardStatus").default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "reward_107_PRIMARY", columns: [table["uid"], table["version"]] }),
  uniqueIndex("reward_107_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\""), sql.raw("rtrim(\"version\", ' ') COLLATE \"C\"")),
  index("reward_107_time_idx").on(sql.raw("\"endTime\"")),
  index("reward_107_stat_idx").on(sql.raw("\"rewardStatus\"")),
]);
