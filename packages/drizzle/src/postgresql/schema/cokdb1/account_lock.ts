// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const account_lock = cokdb1.table("account_lock", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull(),
  "lastLoginIp": legacyText("lastLoginIp", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}),
  "lastDeviceId": legacyText("lastDeviceId", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}),
  "lockSwitch": smallint("lockSwitch"),
  "locked": smallint("locked"),
  "emailAddr": legacyText("emailAddr", {"sqlType":"character varying(200)","collation":"legacy_meta.ci"}),
  "password": legacyText("password", {"sqlType":"character varying(20)","collation":"legacy_meta.ci"}),
  "verifCode": legacyText("verifCode", {"sqlType":"character varying(4)","collation":"legacy_meta.ci"}),
  "verifCodeTime": bigint("verifCodeTime", { mode: "bigint" }),
  "todayTime": bigint("todayTime", { mode: "bigint" }),
  "passwordErrorNum": integer("passwordErrorNum"),
  "passwordErrorTime": bigint("passwordErrorTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "account_lock_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("account_lock_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  check("account_lock_lockSwitch_range", sql.raw("\"lockSwitch\" BETWEEN -128 AND 127")),
  check("account_lock_locked_range", sql.raw("\"locked\" BETWEEN -128 AND 127")),
]);
