import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exception_user = opencok_kingdom.table("exception_user", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull(),
  "day": varchar("day", { length: 10 }).notNull(),
  "count": integer("count"),
  "updateTime": bigint("updateTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "exception_user_PRIMARY", columns: [table["uid"], table["type"], table["day"]] }),
]);
