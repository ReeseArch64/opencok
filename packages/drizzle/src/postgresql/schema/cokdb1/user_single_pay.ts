// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_single_pay = cokdb1.table("user_single_pay", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "productId": legacyText("productId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "canRecNum": integer("canRecNum"),
  "hasRecNum": integer("hasRecNum"),
}, (table) => [
  primaryKey({ name: "user_single_pay_PRIMARY", columns: [table["uid"], table["productId"]] }),
  uniqueIndex("user_single_pay_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"productId\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
