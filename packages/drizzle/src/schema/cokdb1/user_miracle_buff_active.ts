import { primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_miracle_buff_active = cokdb1.table("user_miracle_buff_active", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "level": smallint("level"),
}, (table) => [
  primaryKey({ name: "user_miracle_buff_active_PRIMARY", columns: [table["uid"]] }),
]);
