// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_resource_log = cokdb1.table("user_resource_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "day": legacyText("day", {"sqlType":"character varying(10)","collation":"legacy_meta.ci"}).notNull(),
  "resourceType": integer("resourceType").notNull(),
  "actionType": integer("actionType").notNull(),
  "rewardType": integer("rewardType").notNull(),
  "count": bigint("count", { mode: "bigint" }).default(sql.raw("0")),
  "times": integer("times").default(sql.raw("0")),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_resource_log_PRIMARY", columns: [table["uid"], table["day"], table["resourceType"], table["actionType"], table["rewardType"]] }),
  uniqueIndex("user_resource_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"day\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"resourceType\""), sql.raw("\"actionType\""), sql.raw("\"rewardType\"")),
]);
