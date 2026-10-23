// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const account_new_oldbigone = cokdb_global.table("account_new_oldbigone", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "server": legacyText("server", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "uuid": legacyText("uuid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull(),
  "deviceId": legacyText("deviceId", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "gaid": legacyText("gaid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "country": legacyText("country", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "emailAccount": legacyText("emailAccount", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "googleAccount": legacyText("googleAccount", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "googleAccountName": legacyText("googleAccountName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "facebookAccount": legacyText("facebookAccount", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "facebookAccountName": legacyText("facebookAccountName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "pf": legacyText("pf", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "pfId": legacyText("pfId", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "gameUserName": legacyText("gameUserName", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "gameUserLevel": integer("gameUserLevel").notNull(),
  "lastTime": bigint("lastTime", { mode: "bigint" }).notNull(),
  "emailConfirm": integer("emailConfirm").default(sql.raw("0")),
  "passmd5": legacyText("passmd5", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "account_new_oldbigone_PRIMARY", columns: [table["gameUid"]] }),
  uniqueIndex("account_new_oldbigone_PRIMARY_pad").on(sql.raw("rtrim(\"gameUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("account_new_oldbigone_google_lasttime_index").on(sql.raw("rtrim(\"googleAccount\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_facebook_lasttime_index").on(sql.raw("rtrim(\"facebookAccount\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_deviceId_lasttime_index").on(sql.raw("rtrim(\"deviceId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_email_lasttime_index").on(sql.raw("rtrim(\"emailAccount\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_pf_pi_lasttime_index").on(sql.raw("rtrim(\"pf\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("rtrim(\"pfId\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"lastTime\"")),
  index("account_new_oldbigone_server_id_index").on(sql.raw("rtrim(\"server\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("account_new_oldbigone_username_index").on(sql.raw("rtrim(\"gameUserName\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("account_new_oldbigone_gaid_index").on(sql.raw("rtrim(\"gaid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
