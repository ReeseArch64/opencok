import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const king_present_record = opencok_kingdom.table("king_present_record", {
  "toUserId": varchar("toUserId", { length: 40 }).notNull(),
  "presentId": integer("presentId").notNull(),
  "presentNameId": integer("presentNameId").notNull(),
  "sendTime": bigint("sendTime", { mode: "bigint" }).notNull(),
  "abbr": varchar("abbr", { length: 10 }),
}, (table) => [
  primaryKey({ name: "king_present_record_PRIMARY", columns: [table["toUserId"]] }),
]);
