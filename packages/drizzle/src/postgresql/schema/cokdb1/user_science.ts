// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_science = cokdb1.table("user_science", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "level": integer("level").notNull().default(sql.raw("0")),
  "cd": bigint("cd", { mode: "bigint" }).notNull().default(sql.raw("9223372036854775807")),
}, (table) => [
  primaryKey({ name: "user_science_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  uniqueIndex("user_science_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_science_Index_ownerId").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
