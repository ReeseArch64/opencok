import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const gold_eggs = opencok_kingdom.table("gold_eggs", {
  "uid": varchar("uid", { length: 96 }).notNull(),
  "flushfreetimes": integer("flushfreetimes").notNull().default(sql.raw("0")),
  "flushtime": bigint("flushtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "flushcount": integer("flushcount").notNull().default(sql.raw("0")),
  "statelist": varchar("statelist", { length: 1024 }).notNull().default(sql.raw("''")),
  "freetimes": integer("freetimes").notNull().default(sql.raw("0")),
  "everydaytime": bigint("everydaytime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "multiple": integer("multiple").notNull().default(sql.raw("1")),
  "score": bigint("score", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "score_reward": varchar("score_reward", { length: 512 }).notNull().default(sql.raw("''")),
  "ranking": integer("ranking").notNull().default(sql.raw("0")),
  "createtime": bigint("createtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "onlogintime": bigint("onlogintime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gold_eggs_PRIMARY", columns: [table["uid"]] }),
]);
