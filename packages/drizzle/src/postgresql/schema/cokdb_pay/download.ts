// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const download = cokdb_pay.table("download", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "download_Id_seq", startWith: 12 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "app_icon": legacyText("app_icon", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "platform": legacyText("platform", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "link": legacyText("link", {"sqlType":"text","collation":"legacy_meta.ci"}),
  "version": legacyText("version", {"sqlType":"character varying(11)","collation":"legacy_meta.ci"}),
  "status": integer("status").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "download_PRIMARY", columns: [table["Id"]] }),
]);
