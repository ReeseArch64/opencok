import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_reg = cokdb1.table("user_reg", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "appVersion": varchar("appVersion", { length: 40 }),
  "deviceId": varchar("deviceId", { length: 255 }),
}, (table) => [
  primaryKey({ name: "user_reg_PRIMARY", columns: [table["uid"]] }),
]);
