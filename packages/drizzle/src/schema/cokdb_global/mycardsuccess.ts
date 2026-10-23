import { sql } from "drizzle-orm";
import { bigint, check, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { cokdb_global } from "../namespaces";

export const mycardsuccess = cokdb_global.table("mycardsuccess", {
  "tradeseq": varchar("tradeseq", { length: 200 }).notNull(),
  "mycardid": varchar("mycardid", { length: 200 }).notNull(),
  "time": bigint("time", { mode: "bigint" }).notNull(),
  "type": varchar("type", { length: 20 }),
  "fulldata": bytea("fulldata").notNull(),
  "state": integer("state").default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "mycardsuccess_PRIMARY", columns: [table["tradeseq"]] }),
  index("mycardsuccess_index_time").on(sql.raw("\"time\"")),
  index("mycardsuccess_index_mycardid").on(sql.raw("\"mycardid\"")),
  check("mycardsuccess_fulldata_length", sql.raw("octet_length(\"fulldata\") <= 65535")),
]);
