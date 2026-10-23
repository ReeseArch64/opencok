import { sql } from "drizzle-orm";
import { check, integer, text, varchar } from "drizzle-orm/pg-core";
import { opencok_pay } from "../namespaces";

export const logs_packages = opencok_pay.table("logs_packages", {
  "usn": integer("usn"),
  "uid": varchar("uid", { length: 40 }),
  "packid": integer("packid"),
  "price": integer("price"),
  "originalpoints": varchar("originalpoints", { length: 50 }),
  "points": varchar("points", { length: 50 }),
  "time": text("time").default(sql.raw("'0000-00-00 00:00:00'")),
  "serverid": integer("serverid").default(sql.raw("0")),
  "db": varchar("db", { length: 10 }),
  "ip": varchar("ip", { length: 40 }),
  "browser": varchar("browser", { length: 40 }),
  "os": varchar("os", { length: 255 }),
}, (_table) => [
  check("logs_packages_time_temporal", sql.raw("(\"time\" IS NULL OR (CASE WHEN \"time\" ~ '^[0-9]{4}-(0[0-9]|1[0-2])-(0[0-9]|[12][0-9]|3[01]) ([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$' THEN CASE WHEN left(\"time\",4) <> '0000' AND substring(\"time\",6,2) <> '00' AND substring(\"time\",9,2) <> '00' THEN to_char(to_date(left(\"time\",10),'YYYY-MM-DD'),'YYYY-MM-DD') = left(\"time\",10) ELSE true END ELSE false END))")),
]);
