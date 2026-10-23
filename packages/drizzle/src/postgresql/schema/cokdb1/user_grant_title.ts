// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_grant_title = cokdb1.table("user_grant_title", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "endtime": bigint("endtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "targetuid": legacyText("targetuid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "user_grant_title_PRIMARY", columns: [table["uid"], table["endtime"], table["targetuid"]] }),
  uniqueIndex("user_grant_title_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"endtime\""), sql.raw("rtrim(\"targetuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
