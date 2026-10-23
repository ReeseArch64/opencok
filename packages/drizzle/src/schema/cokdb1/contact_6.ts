import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const contact_6 = cokdb1.table("contact_6", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "friendUid": varchar("friendUid", { length: 255 }).notNull(),
  "stat": integer("stat").default(sql.raw("0")),
  "description": bytea("description"),
}, (table) => [
  primaryKey({ name: "contact_6_PRIMARY", columns: [table["uid"], table["friendUid"]] }),
  check("contact_6_description_length", sql.raw("octet_length(\"description\") <= 65535")),
]);
