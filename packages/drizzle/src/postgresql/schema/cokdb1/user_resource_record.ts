// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_resource_record = cokdb1.table("user_resource_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "itemId": legacyText("itemId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "wood": bigint("wood", { mode: "bigint" }),
  "stone": bigint("stone", { mode: "bigint" }),
  "iron": bigint("iron", { mode: "bigint" }),
  "food": bigint("food", { mode: "bigint" }),
  "wood_bind": bigint("wood_bind", { mode: "bigint" }),
  "stone_bind": bigint("stone_bind", { mode: "bigint" }),
  "iron_bind": bigint("iron_bind", { mode: "bigint" }),
  "food_bind": bigint("food_bind", { mode: "bigint" }),
  "costItem": legacyText("costItem", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_resource_record_PRIMARY", columns: [table["uid"], table["itemId"]] }),
  uniqueIndex("user_resource_record_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_resource_record_uid_idx").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_resource_record_item_idx").on(sql.raw("rtrim(\"itemId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
