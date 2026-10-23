import { sql } from "drizzle-orm";
import { integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const cn_regpay_accumulative = cokdb_global.table("cn_regpay_accumulative", {
  "date": integer("date").notNull(),
  "pf": varchar("pf", { length: 40 }).notNull().default(sql.raw("''")),
  "reg": integer("reg").default(sql.raw("0")),
  "payucnt": integer("payucnt").default(sql.raw("0")),
  "paysum": integer("paysum").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "cn_regpay_accumulative_PRIMARY", columns: [table["date"], table["pf"]] }),
]);
