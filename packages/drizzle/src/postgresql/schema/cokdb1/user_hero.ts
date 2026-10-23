// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_hero = cokdb1.table("user_hero", {
  "ownerUid": legacyText("ownerUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "heroUid": legacyText("heroUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "heroState": integer("heroState").notNull().default(sql.raw("0")),
  "captureTime": bigint("captureTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "killTime": bigint("killTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "revivalTime": bigint("revivalTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "freeTime": bigint("freeTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashTime": bigint("thrashTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashNum": integer("thrashNum").notNull().default(sql.raw("0")),
  "captureCD": bigint("captureCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "killCD": bigint("killCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "thrashCD": bigint("thrashCD", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "revivalCD": bigint("revivalCD", { mode: "bigint" }).default(sql.raw("0")),
  "lastKillerUid": legacyText("lastKillerUid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "user_hero_PRIMARY", columns: [table["heroUid"]] }),
  uniqueIndex("user_hero_PRIMARY_pad").on(sql.raw("rtrim(\"heroUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_hero_ownerUid_index").on(sql.raw("rtrim(\"ownerUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
