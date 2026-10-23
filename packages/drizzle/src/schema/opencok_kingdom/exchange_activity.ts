import { sql } from "drizzle-orm";
import { bigint, check, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { bytea } from "../../types";
import { opencok_kingdom } from "../namespaces";

export const exchange_activity = opencok_kingdom.table("exchange_activity", {
  "uid": varchar("uid", { length: 40 }).notNull(),
  "actId": varchar("actId", { length: 10 }).notNull(),
  "reward": bytea("reward"),
  "refresh": integer("refresh").default(sql.raw("0")),
  "refreshTime": bigint("refreshTime", { mode: "bigint" }).default(sql.raw("0")),
}, (table) => [
  primaryKey({ name: "exchange_activity_PRIMARY", columns: [table["uid"], table["actId"]] }),
  check("exchange_activity_reward_length", sql.raw("octet_length(\"reward\") <= 65535")),
]);
