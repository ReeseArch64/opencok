import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const def_time = cokdb1.table("def_time", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "def_time_PRIMARY", columns: [table["uid"]] }),
]);
