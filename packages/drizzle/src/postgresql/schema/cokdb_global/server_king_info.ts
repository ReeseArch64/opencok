// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const server_king_info = cokdb_global.table("server_king_info", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "server_king_info_Id_seq", startWith: 3 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "banner": legacyText("banner", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingName": legacyText("kingName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingAllianceName": legacyText("kingAllianceName", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingAllianceAbbr": legacyText("kingAllianceAbbr", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "kingAllianceIcon": legacyText("kingAllianceIcon", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "server_king_info_PRIMARY", columns: [table["Id"]] }),
]);
