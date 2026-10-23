import { sql } from "drizzle-orm";
import { bigint, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const user_assets = cokdb1.table("user_assets", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "winPoint": bigint("winPoint", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "lastUpdateTime": bigint("lastUpdateTime", { mode: "bigint" }).default(sql.raw("0")),
  "lastprottectTime": bigint("lastprottectTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_assets_PRIMARY", columns: [table["uid"]] }),
]);
