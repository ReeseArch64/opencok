// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { index, integer } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const server_mail_record = cokdb1.table("server_mail_record", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "record": legacyText("record", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "state": integer("state").default(sql.raw("0")),
}, (_table) => [
  index("server_mail_record_index_uid").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"record\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"state\"")),
  index("server_mail_record_index_record").on(sql.raw("rtrim(\"record\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"state\"")),
]);
