import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_gift_vote = cokdb1.table("user_gift_vote", {
  "uid": varchar("uid", { length: 50 }).notNull(),
  "version": integer("version").notNull(),
  "type": integer("type").notNull(),
  "giftId": integer("giftId").notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_gift_vote_PRIMARY", columns: [table["uid"], table["version"], table["type"], table["giftId"]] }),
]);
