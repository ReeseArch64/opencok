import { sql } from "drizzle-orm";
import { integer } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const new_recall_relation = opencok_global.table("new_recall_relation", {
  "activeUid": integer("activeUid").notNull().default(sql.raw("0")),
});
