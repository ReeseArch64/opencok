import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_cross_server = cokdb1.table("user_cross_server", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "fromServerId": integer("fromServerId"),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_cross_server_PRIMARY", columns: [table["uid"]] }),
]);
