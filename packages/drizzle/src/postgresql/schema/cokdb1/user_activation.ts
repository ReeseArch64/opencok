// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_activation = cokdb1.table("user_activation", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "data": legacyBytes("data"),
}, (table) => [
  primaryKey({ name: "user_activation_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_activation_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("user_activation_data_length", sql.raw("octet_length(\"data\") <= 65535")),
]);
