import { sql } from "drizzle-orm";
import { check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const user_talent = cokdb1.table("user_talent", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "talent": bytea("talent"),
}, (table) => [
  primaryKey({ name: "user_talent_PRIMARY", columns: [table["uid"]] }),
  check("user_talent_talent_length", sql.raw("octet_length(\"talent\") <= 65535")),
]);
