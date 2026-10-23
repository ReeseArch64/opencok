// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, numeric, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const points_packages = cokdb_pay.table("points_packages", {
  "id": integer("id").notNull().generatedByDefaultAsIdentity({ name: "points_packages_id_seq", startWith: 2 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "points": integer("points").notNull(),
  "price": numeric("price", { precision: 10, scale: 2 }).notNull(),
}, (table) => [
  primaryKey({ name: "points_packages_PRIMARY", columns: [table["id"]] }),
]);
