// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_resource_copy = cokdb1.table("user_resource_copy", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "stone": integer("stone").notNull(),
  "wood": integer("wood").notNull(),
  "iron": integer("iron").notNull(),
  "food": integer("food").notNull(),
  "silver": integer("silver").notNull(),
  "chip": integer("chip").notNull(),
  "diamond": integer("diamond").notNull(),
  "dragon_food": integer("dragon_food").notNull(),
  "dragon_gold": integer("dragon_gold").notNull(),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_resource_copy_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_resource_copy_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
