import { sql } from "drizzle-orm";
import { primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_reg_copy = opencok_kingdom.table(
  "user_reg_copy",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "appVersion": varchar("appVersion", { length: 40 }),
    "deviceId": varchar("deviceId", { length: 255 }),
  },
  (table) => [primaryKey({ name: "user_reg_copy_PRIMARY", columns: [table["uid"]] })],
);
