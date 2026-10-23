import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_device_bind_hide = cokdb1.table("user_device_bind_hide", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "hideUid": varchar("hideUid", { length: 40 }).notNull(),
  "time": bigint("time", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "user_device_bind_hide_PRIMARY", columns: [table["uid"], table["hideUid"]] }),
]);
