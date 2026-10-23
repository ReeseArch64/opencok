// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const avatar_storage = cokdb1.table("avatar_storage", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "avatarId": legacyText("avatarId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "expirationTime": bigint("expirationTime", { mode: "bigint" }).notNull(),
  "effectiveSign": integer("effectiveSign").notNull().default(sql.raw("0")),
  "username": legacyText("username", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "usetime": bigint("usetime", { mode: "bigint" }),
  "type": integer("type").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "avatar_storage_PRIMARY", columns: [table["uid"], table["avatarId"]] }),
  uniqueIndex("avatar_storage_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"avatarId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
