// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const kingdom_skill_log = cokdb1.table("kingdom_skill_log", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": integer("skillId").notNull(),
  "logTime": bigint("logTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "kingdom_skill_log_PRIMARY", columns: [table["uid"], table["skillId"]] }),
  uniqueIndex("kingdom_skill_log_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"skillId\"")),
]);
