// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_growth_fund = cokdb1.table("user_growth_fund", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "itemId": legacyText("itemId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "buyTime": bigint("buyTime", { mode: "bigint" }),
  "extra": legacyText("extra", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "status": integer("status"),
}, (table) => [
  primaryKey({ name: "user_growth_fund_PRIMARY", columns: [table["uid"], table["type"]] }),
  uniqueIndex("user_growth_fund_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"type\"")),
]);
