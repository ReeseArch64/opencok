import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, text, varchar } from "drizzle-orm/pg-core";
import { cokdb_pay } from "../namespaces";

export const users = cokdb_pay.table("users", {
  "usn": bigint("usn", { mode: "bigint" }).notNull().generatedByDefaultAsIdentity({"name":"users_usn_seq","startWith":1216}),
  "uid": varchar("uid", { length: 40 }).notNull(),
  "usd": integer("usd").notNull().default(sql.raw("0")),
  "name": varchar("name", { length: 15 }),
  "password": varchar("password", { length: 255 }),
  "totalpaid": integer("totalpaid").default(sql.raw("0")),
  "lastbuytime": text("lastbuytime").default(sql.raw("'0000-00-00 00:00:00'")),
  "server": integer("server").default(sql.raw("0")),
  "db": varchar("db", { length: 8 }),
  "email": varchar("email", { length: 40 }),
  "deviceid": varchar("deviceid", { length: 255 }),
  "profile_image": varchar("profile_image", { length: 255 }),
  "banned": integer("banned").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "users_PRIMARY", columns: [table["usn"]] }),
  check("users_lastbuytime_temporal", sql.raw("(\"lastbuytime\" IS NULL OR (CASE WHEN \"lastbuytime\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"lastbuytime\",4) <> '0000' AND substring(\"lastbuytime\",6,2) <> '00' AND substring(\"lastbuytime\",9,2) <> '00' THEN to_char(to_date(left(\"lastbuytime\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"lastbuytime\",10) ELSE true END ELSE false END))")),
]);
