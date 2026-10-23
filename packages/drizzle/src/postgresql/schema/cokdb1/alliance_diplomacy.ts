// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const alliance_diplomacy = cokdb1.table("alliance_diplomacy", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"C"}).notNull(),
  "ally": legacyBytes("ally"),
  "enemy": legacyBytes("enemy"),
  "other": legacyBytes("other"),
}, (table) => [
  primaryKey({ name: "alliance_diplomacy_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("alliance_diplomacy_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"C\"")),
  check("alliance_diplomacy_ally_length", sql.raw("octet_length(\"ally\") <= 65535")),
  check("alliance_diplomacy_enemy_length", sql.raw("octet_length(\"enemy\") <= 65535")),
  check("alliance_diplomacy_other_length", sql.raw("octet_length(\"other\") <= 65535")),
]);
