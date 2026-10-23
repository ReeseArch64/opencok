import { sql } from "drizzle-orm";
import { check, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const celebrity = cokdb1.table("celebrity", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "description": bytea("description"),
}, (table) => [
  primaryKey({ name: "celebrity_PRIMARY", columns: [table["uid"]] }),
  check("celebrity_description_length", sql.raw("octet_length(\"description\") <= 65535")),
]);
