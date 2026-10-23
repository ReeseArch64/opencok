// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const video = cokdb_pay.table("video", {
  "Id": integer("Id").notNull().generatedByDefaultAsIdentity({ name: "video_Id_seq", startWith: 3 }),
  "name": legacyText("name", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "video_key": legacyText("video_key", {"sqlType":"text","collation":"legacy_meta.ci"}).notNull(),
  "status": legacyText("status", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).default(sql.raw("'0'")),
}, (table) => [
  primaryKey({ name: "video_PRIMARY", columns: [table["Id"]] }),
]);
