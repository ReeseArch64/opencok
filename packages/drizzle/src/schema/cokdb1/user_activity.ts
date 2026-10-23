import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_activity = cokdb1.table("user_activity", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "actId": varchar("actId", { length: 255 }).notNull(),
  "status": integer("status").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_activity_PRIMARY", columns: [table["uid"], table["actId"]] }),
]);
