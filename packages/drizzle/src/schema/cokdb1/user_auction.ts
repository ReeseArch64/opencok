import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_auction = cokdb1.table("user_auction", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "gold": bigint("gold", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_auction_PRIMARY", columns: [table["uid"]] }),
]);
