// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_continue_pay = cokdb1.table("user_continue_pay", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "productId": legacyText("productId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "goldCount": integer("goldCount").default(sql.raw("0")),
  "status": integer("status"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_continue_pay_PRIMARY", columns: [table["uid"], table["productId"]] }),
  uniqueIndex("user_continue_pay_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"productId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
