import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const sampleuser = cokdb1.table("sampleuser", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "regTime": bigint("regTime", { mode: "bigint" }).notNull(),
  "tag": integer("tag").notNull(),
}, (table) => [
  primaryKey({ name: "sampleuser_PRIMARY", columns: [table["uid"]] }),
  index("sampleuser_tag_index").on(sql.raw("\"tag\"")),
]);
