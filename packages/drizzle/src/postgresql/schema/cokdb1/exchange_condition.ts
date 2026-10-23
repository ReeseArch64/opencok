// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_condition = cokdb1.table("exchange_condition", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "soldierDead": bigint("soldierDead", { mode: "bigint" }).default(sql.raw("0")),
  "deadFlushTime": bigint("deadFlushTime", { mode: "bigint" }).default(sql.raw("0")),
  "payGold": integer("payGold").default(sql.raw("1")),
  "goldFlushTime": bigint("goldFlushTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_condition_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("exchange_condition_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
