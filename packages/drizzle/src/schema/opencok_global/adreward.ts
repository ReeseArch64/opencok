import { sql } from "drizzle-orm";
import { bigint, index, integer, primaryKey, varchar } from "drizzle-orm/pg-core";
import { opencok_global } from "../namespaces";

export const adreward = opencok_global.table(
  "adreward",
  {
    "device": varchar("device", { length: 100 }).notNull().default(sql.raw("''")),
    "time": bigint("time", { mode: "bigint" }).notNull().default(sql.raw("0")),
    "reward": varchar("reward", { length: 200 }),
    "user": varchar("user", { length: 40 }),
    "state": integer("state").default(sql.raw("0")),
    "sendTime": bigint("sendTime", { mode: "bigint" }),
    "tryTimes": integer("tryTimes").default(sql.raw("0")),
  },
  (table) => [
    primaryKey({ name: "adreward_PRIMARY", columns: [table["device"], table["time"]] }),
    index("adreward_index_time").on(sql.raw('"time"')),
    index("adreward_index_state_tryTime").on(sql.raw('"state"'), sql.raw('"tryTimes"')),
  ],
);
