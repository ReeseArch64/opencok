import { sql } from "drizzle-orm";
import { check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const user_activation = cokdb1.table("user_activation", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "data": bytea("data"),
}, (table) => [
  primaryKey({ name: "user_activation_PRIMARY", columns: [table["uid"]] }),
  check("user_activation_data_length", sql.raw("octet_length(\"data\") <= 65535")),
]);
