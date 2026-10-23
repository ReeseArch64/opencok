// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const army_skill_info = cokdb1.table("army_skill_info", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "armyId": legacyText("armyId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": legacyText("skillId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level").notNull(),
  "exp": integer("exp").notNull(),
}, (table) => [
  primaryKey({ name: "army_skill_info_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("army_skill_info_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("army_skill_info_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
