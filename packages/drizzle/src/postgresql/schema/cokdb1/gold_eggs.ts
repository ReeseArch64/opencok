// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const gold_eggs = cokdb1.table("gold_eggs", {
  "uid": legacyText("uid", {"sqlType":"character varying(96)","collation":"legacy_meta.ci"}).notNull(),
  "flushfreetimes": integer("flushfreetimes").notNull().default(sql.raw("0")),
  "flushtime": bigint("flushtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "flushcount": integer("flushcount").notNull().default(sql.raw("0")),
  "statelist": legacyText("statelist", {"sqlType":"character varying(1024)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "freetimes": integer("freetimes").notNull().default(sql.raw("0")),
  "everydaytime": bigint("everydaytime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "multiple": integer("multiple").notNull().default(sql.raw("1")),
  "score": bigint("score", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "score_reward": legacyText("score_reward", {"sqlType":"character varying(512)","collation":"legacy_meta.ci"}).notNull().default(sql.raw("''")),
  "ranking": integer("ranking").notNull().default(sql.raw("0")),
  "createtime": bigint("createtime", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "onlogintime": bigint("onlogintime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "gold_eggs_PRIMARY", columns: [table["uid"]] }),
  uniqueIndex("gold_eggs_PRIMARY_pad").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
]);
