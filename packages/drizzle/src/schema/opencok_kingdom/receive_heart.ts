import { integer, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const receive_heart = opencok_kingdom.table("receive_heart", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "duration": integer("duration").notNull(),
  "effecttype": varchar("effecttype", { length: 2 }).notNull(),
  "senduid": varchar("senduid", { length: 40 }).notNull(),
});
