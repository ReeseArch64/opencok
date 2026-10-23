// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey } from "drizzle-orm/pg-core";
import { legacyTemporal, legacyText } from "../../types";
import { cokdb_pay } from "../namespaces";
export const users = cokdb_pay.table("users", {
  "usn": bigint("usn", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({ name: "users_usn_seq", startWith: 1216 }),
  "uid": legacyText("uid", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}).notNull(),
  "usd": integer("usd").notNull().default(sql.raw("0")),
  "name": legacyText("name", {"sqlType":"character varying(15)","collation":"legacy_meta.ci"}),
  "password": legacyText("password", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "totalpaid": integer("totalpaid").default(sql.raw("0")),
  "lastbuytime": legacyTemporal("lastbuytime").default(sql.raw("'0000-00-00 00:00:00'")),
  "server": integer("server").default(sql.raw("0")),
  "db": legacyText("db", {"sqlType":"character varying(8)","collation":"legacy_meta.ci"}),
  "email": legacyText("email", {"sqlType":"character varying(40)","collation":"legacy_meta.ci"}),
  "deviceid": legacyText("deviceid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "profile_image": legacyText("profile_image", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "banned": integer("banned").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "users_PRIMARY", columns: [table["usn"]] }),
  check("users_lastbuytime_temporal", sql.raw("legacy_meta.valid_temporal(\"lastbuytime\", 'datetime', 0)")),
]);
