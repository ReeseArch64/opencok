import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_auction_history = opencok_kingdom.table("user_auction_history", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "uuid": varchar("uuid", { length: 255 }).notNull(),
  "itemId": varchar("itemId", { length: 20 }).notNull(),
  "itemNum": integer("itemNum"),
  "price": integer("price"),
  "time": bigint("time", { mode: "bigint" }).notNull(),
}, (table) => [
  primaryKey({ name: "user_auction_history_PRIMARY", columns: [table["uid"], table["uuid"]] }),
  uniqueIndex("user_auction_history_unique_user_auction_history_uuid").on(sql.raw("\"uuid\"")),
  index("user_auction_history_key_user_auction_history_uid").on(sql.raw("\"uid\"")),
]);
