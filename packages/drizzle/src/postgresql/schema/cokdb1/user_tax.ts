// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_tax = cokdb1.table("user_tax", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "wood": bigint("wood", { mode: "bigint" }).notNull(),
  "food": bigint("food", { mode: "bigint" }).notNull(),
  "iron": bigint("iron", { mode: "bigint" }).notNull(),
  "stone": bigint("stone", { mode: "bigint" }).notNull(),
  "silver": bigint("silver", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_tax_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_tax_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
