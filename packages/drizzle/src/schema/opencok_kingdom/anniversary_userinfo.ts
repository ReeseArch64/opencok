import { sql } from "drizzle-orm";
import { bigint, integer, numeric, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const anniversary_userinfo = opencok_kingdom.table(
  "anniversary_userinfo",
  {
    "uid": varchar("uid", { length: 255 }).notNull().default(sql.raw("''")),
    "regtop": bigint("regtop", { mode: "bigint" }).default(sql.raw("0")),
    "power": bigint("power", { mode: "bigint" }).default(sql.raw("0")),
    "powerpercent": numeric("powerpercent", { precision: 10, scale: 2, mode: "number" }),
    "food": bigint("food", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "wood": bigint("wood", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "train": bigint("train", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "armytype": integer("armytype").notNull(),
    "maxtrain": bigint("maxtrain", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "maxtrainpercent": numeric("maxtrainpercent", { precision: 10, scale: 2, mode: "number" }),
    "dead": integer("dead").notNull(),
    "deadpercent": numeric("deadpercent", { precision: 10, scale: 2, mode: "number" }),
    "kill": integer("kill").notNull(),
    "killpercent": numeric("killpercent", { precision: 10, scale: 2, mode: "number" }),
  },
  (table) => [primaryKey({ name: "anniversary_userinfo_PRIMARY", columns: [table["uid"]] })],
);
