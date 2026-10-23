// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const pay_action = cokdb1.table("pay_action", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "exchangeId": legacyText("exchangeId", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "pay_action_PRIMARY", columns: [table["uid"], table["exchangeId"], table["createTime"]] }),
  uniqueIndex("pay_action_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"exchangeId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"createTime\"")),
]);
