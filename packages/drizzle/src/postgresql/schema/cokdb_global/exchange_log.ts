// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const exchange_log = cokdb_global.table("exchange_log", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "exchange_log_Id_seq", startWith: 64 }),
  "orderId": legacyText("orderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "productId": legacyText("productId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
}, (table) => [
  primaryKey({ name: "exchange_log_PRIMARY", columns: [table["Id"]] }),
]);
