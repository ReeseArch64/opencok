// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const fight_king_status = cokdb1.table("fight_king_status", {
  "index": integer("index").notNull(),
  "info": legacyText("info", {"sqlType":"character varying(8192)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "fight_king_status_PRIMARY", columns: [table["index"]] }),
]);
