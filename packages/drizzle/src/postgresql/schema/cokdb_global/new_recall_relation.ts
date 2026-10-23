// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";
export const new_recall_relation = cokdb_global.table("new_recall_relation", {
  "activeUid": integer("activeUid").notNull().default(sql.raw("0")),
});
