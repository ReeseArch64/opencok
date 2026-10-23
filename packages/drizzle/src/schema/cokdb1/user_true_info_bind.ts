import { sql } from "drizzle-orm";
import { index, integer, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_true_info_bind = cokdb1.table("user_true_info_bind", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "phoneNumber": varchar("phoneNumber", { length: 11 }),
  "email": varchar("email", { length: 255 }),
  "phoneReward": integer("phoneReward"),
  "emailReward": integer("emailReward"),
  "trueInfo": integer("trueInfo").notNull(),
}, (_table) => [
  index("user_true_info_bind_uid, trueInfo").on(sql.raw("\"uid\""), sql.raw("\"trueInfo\"")),
]);
