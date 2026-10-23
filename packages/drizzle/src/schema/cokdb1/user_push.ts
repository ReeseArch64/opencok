import { sql } from "drizzle-orm";
import { index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_push = cokdb1.table("user_push", {
  "uid": varchar("uid", { length: 40 }).notNull().default(sql.raw("''")),
  "platform": varchar("platform", { length: 20 }),
  "userId": varchar("userId", { length: 1000 }),
  "channelId": varchar("channelId", { length: 40 }),
  "active": integer("active").default(sql.raw("1")),
}, (table) => [
  primaryKey({ name: "user_push_PRIMARY", columns: [table["uid"]] }),
  index("user_push_userId").on(sql.raw("left(\"userId\", 255)")),
]);
