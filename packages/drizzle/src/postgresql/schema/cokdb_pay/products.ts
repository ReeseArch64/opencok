// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const products = cokdb_pay.table("products", {
  "id": legacyText("id", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'Land of WaR Shop'")),
  "price": legacyText("price", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "shop_type": legacyText("shop_type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'inapp'")),
}, (table) => [
  primaryKey({ name: "products_PRIMARY", columns: [table["id"]] }),
  uniqueIndex("products_PRIMARY_pad").on(sql.raw("rtrim(\"id\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
