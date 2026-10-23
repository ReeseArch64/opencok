import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const logrecord = cokdb1.table("logrecord", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "user": varchar("user", { length: 200 }).notNull(),
  "timeStamp": bigint("timeStamp", { mode: "bigint" }).notNull(),
  "category": integer("category").notNull(),
  "type": integer("type"),
  "param1": integer("param1"),
  "param2": integer("param2"),
  "param3": integer("param3"),
  "param4": integer("param4"),
  "data1": varchar("data1", { length: 255 }),
  "data2": varchar("data2", { length: 255 }),
  "data3": varchar("data3", { length: 255 }),
  "data4": varchar("data4", { length: 255 }),
}, (table) => [
  primaryKey({ name: "logrecord_PRIMARY", columns: [table["uid"]] }),
  index("logrecord_index").on(sql.raw("\"timeStamp\""), sql.raw("\"user\""), sql.raw("\"category\""), sql.raw("\"type\"")),
  index("logrecord_index_2").on(sql.raw("\"user\""), sql.raw("\"category\""), sql.raw("\"type\""), sql.raw("\"timeStamp\"")),
]);
