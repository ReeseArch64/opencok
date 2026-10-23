// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_general = cokdb1.table("user_general", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "generalId": legacyText("generalId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "color": integer("color"),
  "status": integer("status").notNull(),
  "level": integer("level").notNull(),
  "exp": integer("exp").default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
  "ability": legacyBytes("ability"),
  "abilityIndex": integer("abilityIndex").default(sql.raw("1")),
  "plusSkillPoint": integer("plusSkillPoint").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_general_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_general_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_general_uid_index_001").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_general_ability_length", sql.raw("octet_length(\"ability\") <= 65535")),
]);
