import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const cn_regpay = opencok_global.table(
  "cn_regpay",
  {
    "date": integer("date").notNull(),
    "pf": varchar("pf", { length: 40 }).notNull().default(sql.raw("''")),
    "dau": integer("dau").notNull().default(sql.raw("0")),
    "reg": integer("reg").default(sql.raw("0")),
    "payucnt": integer("payucnt").default(sql.raw("0")),
    "paysum": integer("paysum").default(sql.raw("0")),
  },
  (table) => [primaryKey({ name: "cn_regpay_PRIMARY", columns: [table["date"], table["pf"]] })],
);
