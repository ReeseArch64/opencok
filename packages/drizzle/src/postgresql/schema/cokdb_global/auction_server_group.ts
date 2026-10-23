// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const auction_server_group = cokdb_global.table("auction_server_group", {
  "id": integer("id").notNull(),
  "zoneIdStr": legacyText("zoneIdStr", {"sqlType":"character varying(2000)","collation":"legacy_meta.ci"}).notNull(),
}, (table) => [
  primaryKey({ name: "auction_server_group_PRIMARY", columns: [table["id"]] }),
]);
