import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const server_score = cokdb1.table("server_score", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "id": integer("id").notNull(),
  "activity": varchar("activity", { length: 40 }),
  "readyTime": bigint("readyTime", { mode: "bigint" }),
  "beginTime": bigint("beginTime", { mode: "bigint" }),
  "endTime": bigint("endTime", { mode: "bigint" }),
  "rewad": integer("rewad").default(sql.raw("0")),
  "round": integer("round").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "server_score_PRIMARY", columns: [table["uid"]] }),
]);
