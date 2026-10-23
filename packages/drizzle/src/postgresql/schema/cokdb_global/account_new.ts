// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb_global } from "../namespaces";
export const account_new = cokdb_global.table("account_new", {
  "gameUid": legacyText("gameUid", {"sqlType":"character varying(100)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
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
  "passmd5": legacyText("passmd5", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).default(sql.raw("''")),
  "active": integer("active").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "account_new_PRIMARY", columns: [table["gameUid"]] }),
  uniqueIndex("account_new_PRIMARY_pad").on(sql.raw("rtrim(\"gameUid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
