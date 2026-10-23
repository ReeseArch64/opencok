import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const atk_name = opencok_kingdom.table(
  "atk_name",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "name": varchar("name", { length: 255 }),
  },
  (table) => [primaryKey({ name: "atk_name_PRIMARY", columns: [table["uid"]] })],
);
