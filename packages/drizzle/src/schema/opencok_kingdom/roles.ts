import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const roles = opencok_kingdom.table(
  "roles",
  {
    "role_id": integer("role_id")
      .notNull()
      .generatedByDefaultAsIdentity({ "name": "roles_role_id_seq", "startWith": 1 }),
    "role_name": varchar("role_name", { length: 50 }),
    "role_flag": varchar("role_flag", { length: 50 }),
  },
  (table) => [primaryKey({ name: "roles_PRIMARY", columns: [table["role_id"]] })],
);
