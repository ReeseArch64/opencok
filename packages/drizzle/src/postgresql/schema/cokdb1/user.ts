// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user = cokdb1.table("user", {
  "id": bigint("id", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "age": bigint("age", { mode: "bigint" }),
  "email": legacyText("email", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "user_PRIMARY", columns: [table["id"]] }),
]);
