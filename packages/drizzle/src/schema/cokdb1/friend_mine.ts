import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const friend_mine = cokdb1.table("friend_mine", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "itemId": integer("itemId"),
  "helpCount": integer("helpCount"),
  "time": bigint("time", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "friend_mine_PRIMARY", columns: [table["uid"]] }),
]);
