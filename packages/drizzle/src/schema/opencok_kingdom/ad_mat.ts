import { sql } from "drizzle-orm";
import { index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const ad_mat = opencok_kingdom.table("ad_mat", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "matId": varchar("matId", { length: 200 }).notNull(),
}, (table) => [
  primaryKey({ name: "ad_mat_PRIMARY", columns: [table["uid"]] }),
  index("ad_mat_index_query").on(sql.raw("\"matId\"")),
]);
