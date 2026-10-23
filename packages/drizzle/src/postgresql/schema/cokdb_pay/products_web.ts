// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const products_web = cokdb_pay.table("products_web", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "products_web_Id_seq", startWith: 2 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "price": legacyText("price", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "type": legacyText("type", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "products_web_PRIMARY", columns: [table["Id"]] }),
]);
