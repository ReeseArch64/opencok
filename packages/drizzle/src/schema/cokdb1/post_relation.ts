import { sql } from "drizzle-orm";
import { bigint, index, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const post_relation = cokdb1.table("post_relation", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "publicValue": varchar("publicValue", { length: 600 }),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "players": varchar("players", { length: 600 }),
}, (table) => [
  primaryKey({ name: "post_relation_PRIMARY", columns: [table["uid"]] }),
  index("post_relation_index_time").on(sql.raw("\"time\"")),
]);
