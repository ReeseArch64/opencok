import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const account_lock = cokdb1.table("account_lock", {
  "uid": varchar("uid", { length: 255 }).notNull(),
  "lastLoginIp": varchar("lastLoginIp", { length: 50 }),
  "lastDeviceId": varchar("lastDeviceId", { length: 255 }),
  "lockSwitch": smallint("lockSwitch"),
  "locked": smallint("locked"),
  "emailAddr": varchar("emailAddr", { length: 200 }),
  "password": varchar("password", { length: 20 }),
  "verifCode": varchar("verifCode", { length: 4 }),
  "verifCodeTime": bigint("verifCodeTime", { mode: "bigint" }),
  "todayTime": bigint("todayTime", { mode: "bigint" }),
  "passwordErrorNum": integer("passwordErrorNum"),
  "passwordErrorTime": bigint("passwordErrorTime", { mode: "bigint" }),
}, (table) => [
  primaryKey({ name: "account_lock_PRIMARY", columns: [table["uid"]] }),
  check("account_lock_lockSwitch_range", sql.raw("\"lockSwitch\" BETWEEN -128 AND 127")),
  check("account_lock_locked_range", sql.raw("\"locked\" BETWEEN -128 AND 127")),
]);
