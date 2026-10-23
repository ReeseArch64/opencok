// Generated from the public MariaDB baseline by scripts/postgresql/generate.ts.
import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, uniqueIndex } from "drizzle-orm/pg-core";
import { legacyText } from "../../types";
import { cokdb1 } from "../namespaces";
export const user_balance_history_5 = cokdb1.table("user_balance_history_5", {
  "uuid": legacyText("uuid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "uid": legacyText("uid", {"sqlType":"character varying(50)","collation":"legacy_meta.ci"}).notNull(),
  "bank_type": integer("bank_type").notNull().default(sql.raw("0")),
  "type": integer("type").notNull().default(sql.raw("0")),
  "num": bigint("num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "original_num": bigint("original_num", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_sum": bigint("curr_sum", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_charge0": bigint("curr_charge0", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "curr_usable_income": bigint("curr_usable_income", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
  "state": integer("state").notNull().default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "user_balance_history_5_PRIMARY", columns: [table["uuid"]] }),
  uniqueIndex("user_balance_history_5_PRIMARY_pad").on(sql.raw("rtrim(\"uuid\", ' ') COLLATE \"legacy_meta\".\"ci\"")),
  index("user_balance_history_5_uid_bank_type").on(sql.raw("rtrim(\"uid\", ' ') COLLATE \"legacy_meta\".\"ci\""), sql.raw("\"bank_type\"")),
  index("user_balance_history_5_time").on(sql.raw("\"time\"")),
]);
