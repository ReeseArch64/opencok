// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const ability_page = cokdb1.table("ability_page", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "page": integer("page").notNull().default(sql.raw("0")),
  "ability": legacyBytes("ability"),
}, (table) => [
  primaryKey({ name: "ability_page_PRIMARY", columns: [table["uid"], table["page"]] }),
  uniqueIndex("ability_page_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"page\"")),
  check("ability_page_ability_length", sql.raw("octet_length(\"ability\") <= 65535")),
]);
