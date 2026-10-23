// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_knight_title = cokdb1.table("user_knight_title", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "activity_title": integer("activity_title").notNull(),
  "unlock_title": legacyBytes("unlock_title"),
  "contract_activity_title": integer("contract_activity_title").notNull().default(sql.raw("-1")),
  "contract_unlock_title": legacyBytes("contract_unlock_title"),
  "normal_unlock_title": legacyBytes("normal_unlock_title"),
  "activeshortCut": legacyText("activeshortCut", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_knight_title_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_knight_title_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_knight_title_unlock_title_length", sql.raw("octet_length(\"unlock_title\") <= 65535")),
  check("user_knight_title_contract_unlock_title_length", sql.raw("octet_length(\"contract_unlock_title\") <= 65535")),
  check("user_knight_title_normal_unlock_title_length", sql.raw("octet_length(\"normal_unlock_title\") <= 65535")),
]);
