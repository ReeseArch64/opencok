// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const payments_api = cokdb_pay.table("payments_api", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "payments_api_id_seq", startWith: 1 }),
  "paymentId": legacyText("paymentId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "orderId": legacyText("orderId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "productId": legacyText("productId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "payerId": legacyText("payerId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "successTimestamp": legacyTemporal("successTimestamp").notNull().default(sql.raw("legacy_meta.utc_now(0)")),
  "status": legacyText("status", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "payments_api_PRIMARY", columns: [table["id"]] }),
  check("payments_api_successTimestamp_temporal", sql.raw("legacy_meta.valid_temporal(\"successTimestamp\", 'timestamp', 0)")),
]);
