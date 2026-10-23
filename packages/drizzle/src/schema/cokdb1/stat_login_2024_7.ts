import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb1 } from "../namespaces";

export const stat_login_2024_7 = cokdb1.table("stat_login_2024_7", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "disconnect": bigint("disconnect", { mode: "bigint" }).default(sql.raw("0")),
  "ip": varchar("ip", { length: 20 }),
  "level": integer("level"),
  "castlelevel": integer("castlelevel"),
  "payTotal": bigint("payTotal", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "deviceId": varchar("deviceId", { length: 255 }),
  "regTime": bigint("regTime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "pf": varchar("pf", { length: 20 }),
  "country": varchar("country", { length: 10 }),
  "trulyip": varchar("trulyip", { length: 20 }),
  "linkname": varchar("linkname", { length: 40 }),
  "curpf": varchar("curpf", { length: 20 }),
  "curcountry": varchar("curcountry", { length: 10 }),
  "curgaid": varchar("curgaid", { length: 40 }),
  "curdeviceid": varchar("curdeviceid", { length: 255 }),
  "appversion": varchar("appversion", { length: 40 }),
  "curip": varchar("curip", { length: 20 }),
}, (table) => [
  primaryKey({ name: "stat_login_2024_7_PRIMARY", columns: [table["uid"], table["time"]] }),
  index("stat_login_2024_7_index_timeStamp").on(sql.raw("\"time\"")),
]);
