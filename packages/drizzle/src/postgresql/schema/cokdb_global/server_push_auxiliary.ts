// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { check, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyBytes, legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const server_push_auxiliary = cokdb_global.table("server_push_auxiliary", {
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "serverStr": legacyBytes("serverStr"),
  "sqlStr": legacyBytes("sqlStr"),
  "status": integer("status").default(sql.raw("0")),
  "operationTime": legacyText("operationTime", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
}, (table) => [
  primaryKey({ name: "server_push_auxiliary_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("server_push_auxiliary_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("server_push_auxiliary_serverStr_length", sql.raw("octet_length(\"serverStr\") <= 65535")),
  check("server_push_auxiliary_sqlStr_length", sql.raw("octet_length(\"sqlStr\") <= 16777215")),
]);
