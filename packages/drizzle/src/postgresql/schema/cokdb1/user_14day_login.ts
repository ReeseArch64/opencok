// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_14day_login = cokdb1.table("user_14day_login", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "day": integer("day").default(sql.raw("0")),
  "lastRewardTime": bigint("lastRewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "vipRewardTime": bigint("vipRewardTime", { mode: "bigint" }).default(sql.raw("0")),
  "reward": legacyText("reward", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_14day_login_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("user_14day_login_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
  index("user_14day_login_day_index").on(sql.raw("\"day\"")),
]);
