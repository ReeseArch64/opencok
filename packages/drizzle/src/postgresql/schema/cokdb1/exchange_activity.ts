// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_activity = cokdb1.table("exchange_activity", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "actId": legacyText("actId", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "reward": legacyBytes("reward"),
  "refresh": integer("refresh").default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_activity_PRIMARY", columns: [table["uid"], table["actId"]] }),
  uniqueIndex("exchange_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"actId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("exchange_activity_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
