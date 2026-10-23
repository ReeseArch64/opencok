import { integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const receive_heart = cokdb1.table("receive_heart", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "duration": integer("duration").notNull(),
  "effecttype": varchar("effecttype", { length: 2 }).notNull(),
  "senduid": varchar("senduid", { length: 40 }).notNull(),
});
