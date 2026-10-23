// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const new_general_skill = cokdb1.table("new_general_skill", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "newGeneralId": integer("newGeneralId").notNull().default(sql.raw("0")),
  "skillId": legacyText("skillId", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
}, (table) => [
  primaryKey({ name: "new_general_skill_PRIMARY", columns: [table["uid"], table["newGeneralId"], table["skillId"]] }),
  uniqueIndex("new_general_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"newGeneralId\""), sql.raw("rtrim(\"skillId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
