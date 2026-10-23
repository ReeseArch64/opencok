import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_auth = opencok_kingdom.table(
  "user_auth",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "female": integer("female"),
    "sealId": varchar("sealId", { length: 40 }).default(sql.raw("''")),
    "seal": bigint("seal", { mode: "bigint" }).default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "user_auth_PRIMARY", columns: [table["uid"]] })],
);
