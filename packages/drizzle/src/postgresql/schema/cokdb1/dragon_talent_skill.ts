// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const dragon_talent_skill = cokdb1.table("dragon_talent_skill", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "dragonId": integer("dragonId").notNull().default(sql.raw("0")),
  "skillId": legacyText("skillId", {"sqlType":"character varying(60)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "actTime": bigint("actTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "stat": integer("stat"),
  "level": integer("level"),
  "exp": integer("exp"),
  "totalExp": integer("totalExp"),
}, (table) => [
  primaryKey({ name: "dragon_talent_skill_PRIMARY", columns: [table["uid"], table["dragonId"], table["skillId"]] }),
  uniqueIndex("dragon_talent_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"dragonId\""), sql.raw("rtrim(\"skillId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
