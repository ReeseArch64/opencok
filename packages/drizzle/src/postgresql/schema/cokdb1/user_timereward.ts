// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_timereward = cokdb1.table("user_timereward", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "level": integer("level").default(sql.raw("0")),
  "times": integer("times").default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
  "receiveTime": bigint("receiveTime", { mode: "bigint" }).default(sql.raw("0")),
  "rewardInfo": legacyBytes("rewardInfo"),
}, (table) => [
  primaryKey({ name: "user_timereward_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_timereward_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_timereward_rewardInfo_length", sql.raw("octet_length(\"rewardInfo\") <= 65535")),
]);
