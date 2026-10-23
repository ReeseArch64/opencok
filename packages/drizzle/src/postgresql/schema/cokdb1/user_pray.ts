// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_pray = cokdb1.table("user_pray", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "freeFromItem": integer("freeFromItem").default(sql.raw("0")),
  "itemPrayCount": integer("itemPrayCount").default(sql.raw("0")),
  "prayCount": integer("prayCount").default(sql.raw("0")),
  "lastPrayTime": bigint("lastPrayTime", { mode: "bigint" }).default(sql.raw("0")),
  "wood": integer("wood").default(sql.raw("0")),
  "food": integer("food").default(sql.raw("0")),
  "iron": integer("iron").default(sql.raw("0")),
  "silver": integer("silver").default(sql.raw("0")),
  "steel": integer("steel").default(sql.raw("0")),
  "goldwood": integer("goldwood").default(sql.raw("0")),
  "goldfood": integer("goldfood").default(sql.raw("0")),
  "goldiron": integer("goldiron").default(sql.raw("0")),
  "goldsilver": integer("goldsilver").default(sql.raw("0")),
  "goldsteel": integer("goldsteel").default(sql.raw("0")),
  "isFirstFree": integer("isFirstFree").default(sql.raw("0")),
  "isFirstPay": integer("isFirstPay").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_pray_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("user_pray_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_pray_count_idx").on(sql.raw("\"prayCount\"")),
  index("user_pray_date_idx").on(sql.raw("\"lastPrayTime\"")),
]);
