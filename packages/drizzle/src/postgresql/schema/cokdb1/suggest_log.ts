// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const suggest_log = cokdb1.table("suggest_log", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "user": legacyText("user", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}).notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
  "description": legacyBytes("description"),
  "param1": integer("param1"),
  "param2": legacyText("param2", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "suggest_log_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("suggest_log_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("suggest_log_index").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"timeStamp\"")),
  index("suggest_log_index_2").on(sql.raw("rtrim(\"user\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("suggest_log_index_3").on(sql.raw("\"param1\""), sql.raw("rtrim(\"param2\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("suggest_log_description_length", sql.raw("octet_length(\"description\") <= 65535")),
]);
