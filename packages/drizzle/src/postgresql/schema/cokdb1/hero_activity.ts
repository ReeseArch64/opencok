// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const hero_activity = cokdb1.table("hero_activity", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "activityId": legacyText("activityId", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "activityType": integer("activityType"),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "roundTime": bigint("roundTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }).default(sql.raw("0")),
  "finish": integer("finish").default(sql.raw("0")),
  "alreadyEvent": legacyText("alreadyEvent", {"sqlType":"character varying(1000)","collation":"legacy_meta.ci"}),
  "serverGroup": legacyText("serverGroup", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingdomRank": legacyText("kingdomRank", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "hero_activity_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("hero_activity_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("hero_activity_st_idx").on(sql.raw("\"startTime\"")),
  index("hero_activity_et_idx").on(sql.raw("\"endTime\"")),
  index("hero_activity_act_idx").on(sql.raw("rtrim(\"activityId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
