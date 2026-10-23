// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const payments = cokdb_pay.table("payments", {
  "payment_id": integer("payment_id").notNull().generatedByDefaultAsIdentity({ name: "payments_payment_id_seq", startWith: 1 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "uid": legacyText("uid", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}),
  "item_name": legacyText("item_name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "item_number": legacyText("item_number", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "txn_id": legacyText("txn_id", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "payment_gross": legacyNumber("payment_gross", {"sqlType":"numeric(10,2)"}).notNull(),
  "currency_code": legacyText("currency_code", {"sqlType":"character varying(5)","collation":"legacy_meta.ci"}).notNull(),
  "payment_status": legacyText("payment_status", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "payments_PRIMARY", columns: [table["payment_id"]] }),
]);
