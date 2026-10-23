import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb1 } from "../namespaces";

export const stat_reg = cokdb1.table("stat_reg", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "type": integer("type").notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "pf": varchar("pf", { length: 20 }),
  "pfId": varchar("pfId", { length: 200 }),
  "referrer": bytea("referrer"),
  "country": varchar("country", { length: 10 }),
  "ip": varchar("ip", { length: 20 }),
  "ipcountry": varchar("ipcountry", { length: 10 }),
  "linkname": varchar("linkname", { length: 40 }),
  "curip": varchar("curip", { length: 20 }),
}, (table) => [
  primaryKey({ name: "stat_reg_PRIMARY", columns: [table["uid"], table["type"]] }),
  index("stat_reg_index_time_pf_country").on(sql.raw("\"time\""), sql.raw("\"pf\""), sql.raw("\"country\"")),
  index("stat_reg_country_index").on(sql.raw("\"country\"")),
  check("stat_reg_referrer_length", sql.raw("octet_length(\"referrer\") <= 65535")),
]);
