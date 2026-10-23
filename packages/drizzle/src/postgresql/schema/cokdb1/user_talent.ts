// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_talent = cokdb1.table("user_talent", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "talent": legacyBytes("talent"),
}, (table) => [
  primaryKey({ name: "user_talent_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_talent_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_talent_talent_length", sql.raw("octet_length(\"talent\") <= 65535")),
]);
