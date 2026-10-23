// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const celebrity = cokdb1.table("celebrity", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "description": legacyBytes("description"),
}, (table) => [
  primaryKey({ name: "celebrity_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("celebrity_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("celebrity_description_length", sql.raw("octet_length(\"description\") <= 65535")),
]);
