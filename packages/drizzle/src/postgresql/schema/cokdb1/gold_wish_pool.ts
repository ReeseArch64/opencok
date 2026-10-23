// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const gold_wish_pool = cokdb1.table("gold_wish_pool", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "times": integer("times").notNull(),
  "costGold": integer("costGold"),
  "getGold": integer("getGold"),
  "rate": integer("rate"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "gold_wish_pool_PRIMARY", columns: [table["uid"], table["times"]] }),
  uniqueIndex("gold_wish_pool_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"times\"")),
  index("gold_wish_pool_byUid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
