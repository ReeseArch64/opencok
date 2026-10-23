import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const ability_page = opencok_kingdom.table(
  "ability_page",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "page": integer("page").notNull().default(sql.raw("0")),
    "ability": bytea("ability"),
  },
  (table) => [
    primaryKey({ name: "ability_page_PRIMARY", columns: [table["uid"], table["page"]] }),
    check("ability_page_ability_length", sql.raw('octet_length("ability") <= 65535')),
  ],
);
