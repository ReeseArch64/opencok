// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const gold_group_buy = cokdb1.table("gold_group_buy", {
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "flushtime": bigint("flushtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "create_time": bigint("create_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gold_group_buy_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("gold_group_buy_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
