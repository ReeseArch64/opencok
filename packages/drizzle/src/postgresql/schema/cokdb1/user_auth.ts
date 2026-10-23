// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_auth = cokdb1.table("user_auth", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "female": integer("female"),
  "sealId": legacyText("sealId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "seal": bigint("seal", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_auth_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_auth_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
