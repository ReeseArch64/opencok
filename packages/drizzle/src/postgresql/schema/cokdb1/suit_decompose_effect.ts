// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const suit_decompose_effect = cokdb1.table("suit_decompose_effect", {
  "item1": legacyText("item1", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}),
  "item2": legacyText("item2", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "item3": legacyText("item3", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "item4": legacyText("item4", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "item5": legacyText("item5", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "item6": legacyText("item6", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
  "owner": legacyText("owner", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
  "suitid": legacyText("suitid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "suit_decompose_effect_PRIMARY", columns: [table["owner"], table["suitid"]] }),
  uniqueIndex("suit_decompose_effect_PRIMARY_pad").on(sql.raw("rtrim(\"owner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"suitid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("suit_decompose_effect_owner_suit").on(sql.raw("rtrim(\"owner\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"suitid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
