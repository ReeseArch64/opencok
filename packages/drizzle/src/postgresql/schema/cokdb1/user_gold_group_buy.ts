// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_gold_group_buy = cokdb1.table("user_gold_group_buy", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "id": legacyText("id", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "buy_time": bigint("buy_time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "num": integer("num").notNull().default(sql.raw("0")),
  "discount": integer("discount").notNull().default(sql.raw("0")),
  "group_coupon_num": integer("group_coupon_num").notNull().default(sql.raw("0")),
  "isMail": integer("isMail").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_gold_group_buy_PRIMARY", columns: [table["uid"], table["id"], table["buy_time"]] }),
  uniqueIndex("user_gold_group_buy_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"buy_time\"")),
]);
