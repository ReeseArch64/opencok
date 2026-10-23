import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_single_pay = cokdb1.table("user_single_pay", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "productId": varchar("productId", { length: 255 }).notNull(),
  "canRecNum": integer("canRecNum"),
  "hasRecNum": integer("hasRecNum"),
}, (table) => [
  primaryKey({ name: "user_single_pay_PRIMARY", columns: [table["uid"], table["productId"]] }),
]);
