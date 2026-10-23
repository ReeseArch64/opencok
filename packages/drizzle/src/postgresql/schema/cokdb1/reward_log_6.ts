// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const reward_log_6 = cokdb1.table("reward_log_6", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "rewardid": legacyText("rewardid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "nownum": integer("nownum").default(sql.raw("0")),
  "totalnum": bigint("totalnum", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "reward_log_6_PRIMARY", columns: [table["uid"], table["rewardid"]] }),
  uniqueIndex("reward_log_6_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"rewardid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
