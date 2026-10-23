import { sql } from "drizzle-orm";
import { bigint, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { cokdb_global } from "../namespaces";

export const charge_activity = cokdb_global.table("charge_activity", {
  "uuid": varchar("uuid", { length: 255 }).notNull().default(sql.raw("''")),
  "exchangeId": varchar("exchangeId", { length: 255 }),
  "startTime": bigint("startTime", { mode: "bigint" }),
  "rewardTime": bigint("rewardTime", { mode: "bigint" }),
  "buyEndTime": bigint("buyEndTime", { mode: "bigint" }),
  "buyCount": integer("buyCount"),
  "maxBuyCount": integer("maxBuyCount"),
  "rewardStatus": integer("rewardStatus"),
  "round": integer("round"),
}, (table) => [
  primaryKey({ name: "charge_activity_PRIMARY", columns: [table["uuid"]] }),
]);
