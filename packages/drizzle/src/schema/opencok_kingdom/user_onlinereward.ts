import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const user_onlinereward = opencok_kingdom.table("user_onlinereward", {
  "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
  "online": bigint("online", { mode: "bigint" }).default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
  "use": bigint("use", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_onlinereward_PRIMARY", columns: [table["uid"]] }),
]);
