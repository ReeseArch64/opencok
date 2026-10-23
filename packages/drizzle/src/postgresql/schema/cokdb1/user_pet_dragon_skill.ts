// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pet_dragon_skill = cokdb1.table("user_pet_dragon_skill", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(32)","collation":"legacy_meta.ci"}).notNull(),
  "skillId": legacyText("skillId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level"),
  "exp": integer("exp"),
  "totalExp": integer("totalExp"),
  "ownerId": integer("ownerId"),
  "index1": integer("index1"),
  "strengthenLevel": integer("strengthenLevel").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_pet_dragon_skill_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_pet_dragon_skill_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_pet_dragon_skill_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
