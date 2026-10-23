import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const flower_notice = cokdb1.table("flower_notice", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "addTime": bigint("addTime", { mode: "bigint" }),
  "targetID": varchar("targetID", { length: 255 }),
  "sourceName": varchar("sourceName", { length: 255 }),
  "sourceID": varchar("sourceID", { length: 255 }),
  "itemID": varchar("itemID", { length: 255 }),
  "itemCount": integer("itemCount"),
}, (table) => [
  primaryKey({ name: "flower_notice_PRIMARY", columns: [table["uid"]] }),
]);
