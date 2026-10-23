// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { bigint, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const badwords = cokdb1.table("badwords", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "badwords_id_seq", startWith: 1 }),
  "words": legacyText("words", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "badwords_PRIMARY", columns: [table["id"]] }),
]);
