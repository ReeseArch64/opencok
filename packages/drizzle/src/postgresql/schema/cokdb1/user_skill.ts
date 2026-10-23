// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_skill = cokdb1.table("user_skill", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "ownerId": legacyText("ownerId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": legacyText("skillId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "startTime": bigint("startTime", { mode: "bigint" }).default(sql.raw("0")),
  "actTime": bigint("actTime", { mode: "bigint" }).default(sql.raw("0")),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat").default(sql.raw("0")),
  "param1": integer("param1").default(sql.raw("0")),
  "param2": integer("param2").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_skill_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_skill_ownerId_index").on(sql.raw("rtrim(\"ownerId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_skill_starttime_index").on(sql.raw("\"startTime\"")),
  index("user_skill_endtime_index").on(sql.raw("\"endTime\"")),
]);
