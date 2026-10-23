import { sql } from "drizzle-orm";
import { check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const user_knight_title = opencok_kingdom.table(
  "user_knight_title",
  {
    "uid": varchar("uid", { length: 255 }).notNull(),
    "activity_title": integer("activity_title").notNull(),
    "unlock_title": bytea("unlock_title"),
    "contract_activity_title": integer("contract_activity_title").notNull().default(sql.raw("-1")),
    "contract_unlock_title": bytea("contract_unlock_title"),
    "normal_unlock_title": bytea("normal_unlock_title"),
    "activeshortCut": varchar("activeshortCut", { length: 255 }).notNull().default(sql.raw("''")),
  },
  (table) => [
    primaryKey({ name: "user_knight_title_PRIMARY", columns: [table["uid"]] }),
    check(
      "user_knight_title_unlock_title_length",
      sql.raw('octet_length("unlock_title") <= 65535'),
    ),
    check(
      "user_knight_title_contract_unlock_title_length",
      sql.raw('octet_length("contract_unlock_title") <= 65535'),
    ),
    check(
      "user_knight_title_normal_unlock_title_length",
      sql.raw('octet_length("normal_unlock_title") <= 65535'),
    ),
  ],
);
