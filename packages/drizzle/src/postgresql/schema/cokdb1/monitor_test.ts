// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const monitor_test = cokdb1.table("monitor_test", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "monitor_test_id_seq", startWith: 1 }),
  "value": legacyText("value", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "monitor_test_PRIMARY", columns: [table["id"]] }),
]);
