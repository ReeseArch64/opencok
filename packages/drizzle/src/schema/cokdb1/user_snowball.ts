import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_snowball = cokdb1.table("user_snowball", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "curLevel": integer("curLevel"),
  "lastThrowTime": bigint("lastThrowTime", { mode: "bigint" }),
  "todayThrowCount": integer("todayThrowCount"),
  "lastBuyTime": bigint("lastBuyTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_snowball_PRIMARY", columns: [table["uid"]] }),
]);
