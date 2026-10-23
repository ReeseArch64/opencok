// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const exchange_order = cokdb1.table("exchange_order", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "itemId": legacyText("itemId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "exchange_order_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("exchange_order_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
