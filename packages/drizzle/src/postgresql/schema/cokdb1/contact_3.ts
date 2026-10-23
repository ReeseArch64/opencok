// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const contact_3 = cokdb1.table("contact_3", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "friendUid": legacyText("friendUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "description": legacyBytes("description"),
}, (table) => [
  primaryKey({ name: "contact_3_PRIMARY", columns: [table["uid"], table["friendUid"]] }),
  uniqueIndex("contact_3_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"friendUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("contact_3_description_length", sql.raw("octet_length(\"description\") <= 65535")),
]);
