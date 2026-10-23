import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const new_general_buy = cokdb1.table("new_general_buy", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "generalId": integer("generalId").notNull(),
  "countType1": integer("countType1").notNull().default(sql.raw("0")),
  "countType2": integer("countType2").notNull().default(sql.raw("0")),
  "countType3": integer("countType3").notNull().default(sql.raw("0")),
  "countType4": integer("countType4").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "new_general_buy_PRIMARY", columns: [table["uid"], table["generalId"]] }),
]);
