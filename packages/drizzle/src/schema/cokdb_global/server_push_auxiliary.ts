import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb_global } from "../namespaces";

export const server_push_auxiliary = cokdb_global.table("server_push_auxiliary", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "serverStr": bytea("serverStr"),
  "sqlStr": bytea("sqlStr"),
  "status": integer("status").default(sql.raw("0")),
  "operationTime": varchar("operationTime", { length: 20 }),
}, (table) => [
  primaryKey({ name: "server_push_auxiliary_PRIMARY", columns: [table["uid"]] }),
  check("server_push_auxiliary_serverStr_length", sql.raw("octet_length(\"serverStr\") <= 65535")),
  check("server_push_auxiliary_sqlStr_length", sql.raw("octet_length(\"sqlStr\") <= 16777215")),
]);
