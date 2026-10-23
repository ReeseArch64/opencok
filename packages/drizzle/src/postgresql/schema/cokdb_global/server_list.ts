// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const server_list = cokdb_global.table("server_list", {
  "id": integer("id").notNull().default(sql.raw("0")),
  "port": integer("port"),
  "name": legacyText("name", {"sqlType":"character varying(64)","collation":"legacy_meta.ci"}),
  "zone": legacyText("zone", {"sqlType":"character varying(8)","collation":"legacy_meta.ci"}),
  "ip": legacyText("ip", {"sqlType":"character varying(128)","collation":"legacy_meta.ci"}),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "server_list_PRIMARY", columns: [table["id"]] }),
  index("server_list_index_ip").on(sql.raw("rtrim(\"ip\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
