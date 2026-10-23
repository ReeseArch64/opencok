import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_grant_title = cokdb1.table("user_grant_title", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "endtime": bigint("endtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "targetuid": varchar("targetuid", { length: 40 }).notNull(),
}, (table) => [
  primaryKey({ name: "user_grant_title_PRIMARY", columns: [table["uid"], table["endtime"], table["targetuid"]] }),
]);
