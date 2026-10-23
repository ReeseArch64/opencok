import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const account_new = opencok_global.table("account_new", {
  "gameUid": varchar("gameUid", { length: 100 }).notNull().default(sql.raw("''")),
  "server": varchar("server", { length: 40 }).notNull(),
  "uuid": varchar("uuid", { length: 100 }).notNull(),
  "deviceId": varchar("deviceId", { length: 200 }),
  "gaid": varchar("gaid", { length: 40 }),
  "country": varchar("country", { length: 40 }),
  "emailAccount": varchar("emailAccount", { length: 200 }),
  "googleAccount": varchar("googleAccount", { length: 200 }),
  "googleAccountName": varchar("googleAccountName", { length: 200 }),
  "facebookAccount": varchar("facebookAccount", { length: 200 }),
  "facebookAccountName": varchar("facebookAccountName", { length: 200 }),
  "pf": varchar("pf", { length: 20 }),
  "pfId": varchar("pfId", { length: 40 }),
  "gameUserName": varchar("gameUserName", { length: 200 }),
  "gameUserLevel": integer("gameUserLevel").notNull(),
  "lastTime": bigint("lastTime", { mode: "bigint" }).notNull(),
  "emailConfirm": integer("emailConfirm").default(sql.raw("0")),
  "passmd5": varchar("passmd5", { length: 40 }).default(sql.raw("''")),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "account_new_PRIMARY", columns: [table["gameUid"]] }),
]);
