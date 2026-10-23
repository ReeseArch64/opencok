import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const account_new_oldbigone = cokdb_global.table("account_new_oldbigone", {
  "gameUid": varchar("gameUid", { length: 100 }).notNull(),
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
  "passmd5": varchar("passmd5", { length: 40 }),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "account_new_oldbigone_PRIMARY", columns: [table["gameUid"]] }),
  index("account_new_oldbigone_google_lasttime_index").on(sql.raw("\"googleAccount\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_facebook_lasttime_index").on(sql.raw("\"facebookAccount\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_deviceId_lasttime_index").on(sql.raw("\"deviceId\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_email_lasttime_index").on(sql.raw("\"emailAccount\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_pf_pi_lasttime_index").on(sql.raw("\"pf\""), sql.raw("\"pfId\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_server_id_index").on(sql.raw("\"server\"")),
  index("account_new_oldbigone_username_index").on(sql.raw("\"gameUserName\"")),
  index("account_new_oldbigone_gaid_index").on(sql.raw("\"gaid\"")),
]);
