// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyNumber, legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const anniversary_userinfo = cokdb1.table("anniversary_userinfo", {
  "uid": legacyText("uid", {"sqlType":"character varying(255)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "regtop": bigint("regtop", { mode: "bigint" }).default(sql.raw("0")),
  "power": bigint("power", { mode: "bigint" }).default(sql.raw("0")),
  "powerpercent": legacyNumber("powerpercent", {"sqlType":"numeric(10,2)"}),
  "food": bigint("food", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "wood": bigint("wood", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "train": bigint("train", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "armytype": integer("armytype").notNull(),
  "maxtrain": bigint("maxtrain", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "maxtrainpercent": legacyNumber("maxtrainpercent", {"sqlType":"numeric(10,2)"}),
  "dead": integer("dead").notNull(),
  "deadpercent": legacyNumber("deadpercent", {"sqlType":"numeric(10,2)"}),
  "kill": integer("kill").notNull(),
  "killpercent": legacyNumber("killpercent", {"sqlType":"numeric(10,2)"}),
}, (table) => [
  primaryKey({ name: "anniversary_userinfo_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("anniversary_userinfo_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
