// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const mod_record = cokdb1.table("mod_record", {
  "id": bigint("id", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "mod_record_id_seq", startWith: 1 }),
  "fromUser": legacyText("fromUser", {"sqlType":"character varying(255)","collation":"C"}),
  "toUser": legacyText("toUser", {"sqlType":"character varying(255)","collation":"C"}),
  "mailType": integer("mailType"),
  "createTime": bigint("createTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "mod_record_PRIMARY", columns: [table["id"]] }),
  index("mod_record_from_idx").on(sql.raw("rtrim(\"fromUser\", ' ') COLLATE \"C\"")),
  index("mod_record_to_idx").on(sql.raw("rtrim(\"toUser\", ' ') COLLATE \"C\"")),
  index("mod_record_time_Idx").on(sql.raw("\"createTime\"")),
]);
