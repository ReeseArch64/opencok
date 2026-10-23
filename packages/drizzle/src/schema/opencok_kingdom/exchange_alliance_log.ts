import { sql } from "drizzle-orm";
import { bigint, check, primaryKey, smallint, varchar } from "drizzle-orm/pg-core";
import { opencok_kingdom } from "../namespaces";

export const exchange_alliance_log = opencok_kingdom.table(
  "exchange_alliance_log",
  {
    "uid": varchar("uid", { length: 40 }).notNull(),
    "orderId": varchar("orderId", { length: 200 }).notNull(),
    "allianceId": varchar("allianceId", { length: 40 }),
    "createTime": bigint("createTime", { mode: "bigint" }).notNull(),
    "status": smallint("status"),
  },
  (table) => [
    primaryKey({
      name: "exchange_alliance_log_PRIMARY",
      columns: [table["uid"], table["orderId"], table["createTime"]],
    }),
    check("exchange_alliance_log_status_range", sql.raw('"status" BETWEEN -128 AND 127')),
  ],
);
